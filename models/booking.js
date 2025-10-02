const mongoose= require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: String, ref: 'Event', required: true },
    bookingDate: { type: Date, default: Date.now },
    status: {type: String,enum: ['confirmed', 'cancelled'],default: 'confirmed'
  }
}, { timestamps: true });

bookingSchema.index({ userId: 1, eventId: 1 ,status:1   });
    
module.exports = mongoose.model('Booking', bookingSchema);