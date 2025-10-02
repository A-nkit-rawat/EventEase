const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const protect = async (req, res, next) => {
  try {
    
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.'
      });
    }

    try {
      // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      
      // Attach user to request
      req.user = decoded;
      // console.log("User authenticated:", req.user);
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in authentication',
      error: error.message
    });
  }
};



const authorize=(role)=>{
    return (req,res,next)=>{
        if(req.user){
        if(!(role ===req.user.role)){
            return res.status(403).json({
                success:false,
                message:"Forbidden: You don't have permission to access this resource"
            });
        }
    }
    else{
        return res.status(401).json({
            success:false,
            message:"Not authorized to access this route. Please login."
        });   
    }
        next();
    }
}
module.exports={protect,authorize};