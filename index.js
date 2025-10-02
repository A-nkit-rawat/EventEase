const express =require("express") ;
const app=express();
const dotenv=require("dotenv")
const mongoose=require("mongoose");
const adminRoutes=require("./routes/adminRoutes.js");
const userRoutes=require("./routes/userRoutes.js");
const loginRoutes=require("./routes/loginRoutes.js");
const cors =require("cors");
const { login } = require("./controllers/authController.js");
const swaggerDocs = require('./config/swagger');

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
// / Swagger Documentation
swaggerDocs(app);
app.use("/api/auth",loginRoutes);
app.use("/api/user",userRoutes);
app.use("/api/admin",adminRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EventEase API',
    documentation: '/api-docs',
    version: '1.0.0'
  });
});

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
