const express =require("express") ;
const app=express();
const dotenv=require("dotenv")
const mongoose=require("mongoose");
const adminRoutes=require("./routes/adminRoutes.js");
const userRoutes=require("./routes/userRoutes.js");
const loginRoutes=require("./routes/loginRoutes.js");
const cors =require("cors");
const { login } = require("./controllers/authController.js");

dotenv.config();

const PORT=process.env.APPLICATION_PORT||8085

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGOOSE_URL).
then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB",err);
})

app.use("/api/auth",loginRoutes);
app.use("/api/user",userRoutes);
app.use("/api/admin",adminRoutes);

//global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
