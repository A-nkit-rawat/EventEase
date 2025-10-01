const express =require("express") ;
const app=express();
const dotenv=require("dotenv")
dotenv.config();
const PORT=process.env.APPLICATION_PORT||8085

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
