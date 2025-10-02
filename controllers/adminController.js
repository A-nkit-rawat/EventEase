const zod = require('zod');
const Event = require('../models/event.js');
const Admin = require('../models/admin.js');
const createEvent = async (req, res) => {
  try {
    const {
      eventName,
      eventSeats,
      eventCategory,
      eventDate,
      eventLocation,
      eventDescription,
    } = req.body;
    if (new Date(eventDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Event date must be in the future'
      });
    }
    // console.log(req.user);
    const event = await Event.create({
      eventName,
      eventSeats,
      eventCategory,
      eventLocation,
      eventDate,
      eventDescription,
      createdBy: req.user.id,

    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });


  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }


}


const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;

    const event = await Event.findOne({ eventId });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    //  if event has started
    // console.log(new Date(event.eventDate));
    // console.log(new Date());  
    // console.log(new Date() >= new Date(event.eventDate));
    if (new Date() >= new Date(event.eventDate) && new Date() > new Date(updates.eventDate) ) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update event that has already started or update event date cannot be in the past '
      });
    }

    // Validate event location if being updated
    if (updates.eventLocation && !['Online', 'In-Person'].includes(updates.eventLocation)) {
      return res.status(400).json({
        success: false,
        message: 'Event location must be either "Online" or "In-Person"'
      });
    }

    // If updating seats, check if new seat count is more than or equal to previous booking seat count
    // console.log(updates.eventSeats);
    if (updates.eventSeats) {
      let bookingCount;
      try{
      bookingCount =   await Booking.countDocuments({
          eventId: eventId,
          status: 'confirmed'
        });
      }
      catch(error){
        bookingCount=0;
      }
      if (updates.eventSeats < bookingCount ? bookingCount : 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot reduce seats below current booking count (${bookingCount})`
        });
      }
    }
    delete updates.eventId;
    const updatedEvent = await Event.findOneAndUpdate(
      {eventId},
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};


const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findOne({eventId});
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event has started
    if (new Date() >= new Date(event.eventDate)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete event that has already started'
      });
    }

    // Cancel all bookings for this event
    try{
      await Booking.updateMany(
      { eventId: eventId, status: 'confirmed' },
      { status: 'cancelled' }
    );
  }
  catch(error){
    // if error occurs while cancelling bookings, log it and proceed to delete event
    // console.error("NO-BOOKINGS-YET");
  }
    

    // Delete the event
    await Event.findOneAndDelete({eventId});

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully and all bookings cancelled'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent
};