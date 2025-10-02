const jwt =require("jsonwebtoken");
const generateToken=async(payload)=>{
    return await jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:'1h'});
}

const verifyToken=async(token)=>{
    try{
        return await jwt.verify(token,process.env.JWT_SECRET_KEY);
    }catch(err){
        return null;
    }
}

module.exports={generateToken,verifyToken};