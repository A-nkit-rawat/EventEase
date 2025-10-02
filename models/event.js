const generateEventId = require("../Helper/generateEventId");

const mongoose =require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
    eventId:{type:String,required:false,unique:true},
    eventName:{type:String,required:true,unique:false},
    eventSeats:{type:Number,required:true,unique:false},
    eventCategory:{type:String,required:true,unique:false},
    eventDate:{type:Date,required:true,unique:false},
    eventLocation:{type:String,enum:['Online','In-Person'],required:true,unique:false},
    eventDescription:{type:String,required:false,unique:false},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'Admin',required:true,unique:false}
},{timestamps:true})

// Middleware to generate event_id before saving if not present
eventSchema.pre('save', function(next) {
    if (!this.eventId) {
        this.eventId=generateEventId(new Date());
    }
    next();
});


module.exports=mongoose.model('Event',eventSchema );