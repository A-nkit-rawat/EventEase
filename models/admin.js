const mongoose = require('mongoose');
const {Schema} = mongoose;

const adminSchema = new Schema({
    username:{type:String, required: true,unique:false},
    email:{type:String, required: true, unique:true},
    password:{type:String, required:true}}
,{timestamps:true}
)
module.exports=mongoose.model('Admin',adminSchema);