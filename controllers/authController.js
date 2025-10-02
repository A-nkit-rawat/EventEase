const User = require("../models/user");
const bcrypt=require('bcrypt');
// const jwtHelper=require("../Helper/jwtHelper");
const jwt=require('jsonwebtoken');
const Admin=require("../models/admin.js");
const registerUser= async(req,res)=>{
  try{
    const {username,email,password}=req.body;
    if(!username || !email || !password){
        return res.status(400).json({ 
            success:false,
            message:"All fields are required"
         })
    }
    if(password.length<6){
        return res.status(400).json({
            success:false,
            message:"Password must be at least 6 characters"
        });
    }

    const existingUser=await User.findOne({email});
    // console.log(existingUser);
    if(existingUser){
      return res.status(400).json({
        success:false,
        message:"User already exists"
      });
    }
    else{
    let hashPassword=await bcrypt.hash(password,10);
    // console.log(hashPassword);
      
      const newUser=await User.create({username,email,password:hashPassword});
      if(newUser){
        const token=jwt.sign({id:newUser._id,email:newUser.email,role:newUser.role},process.env.JWT_SECRET_KEY,{expiresIn:'1h'});
      return res.status(201).json({
        success:true,
        message:"User registered successfully",
        data:newUser,
        token:token
      });}
    }
  }
  catch(error){

  }
}

const login=async(req,res)=>{
  try{
    const{email,password,role}=req.body;
    let user;
    if(role=='admin'){
        user=await Admin.findOne({email});
    }
    else{
         user=await User.findOne({email});
    }
    
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      });
    }
    // console.log(user.password );
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
      return res.status(401).json({
        success:false,
        message:"Invalid password"
      });
    }
    const token=jwt.sign({id:user._id,username:user.username,email:user.email,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:'1h'});
    return res.status(200).json({
      success:true,
      message:"User logged in successfully",
      data:user,
      token:token
    });
  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"Error logging in",
      error:error.message
    });
  }
}
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};




module.exports={registerUser,login,logout};