
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
        const event = await Event.create({
            eventName,
            eventSeats,
            eventCategory,
            eventLocation,
            eventDate,
            eventDescription,
            created_by: req.adminId,

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

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    //  if event has started
    if (new Date() >= new Date(event.eventDate)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update event that has already started'
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
    if (updates.eventSeats) {
      const bookingCount = await Booking.countDocuments({
        eventId: eventId,
        status: 'confirmed'
      });

      if (updates.eventSeats < bookingCount) {
        return res.status(400).json({
          success: false,
          message: `Cannot reduce seats below current booking count (${bookingCount})`
        });
      }
    }
    delete updates.eventId;
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
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

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event has started
    if (new Date() >= new Date(event.event_date)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete event that has already started'
      });
    }

    // Cancel all bookings for this event
    await Booking.updateMany(
      { event_id: eventId, status: 'confirmed' },
      { status: 'cancelled' }
    );

    // Delete the event
    await Event.findByIdAndDelete(eventId);

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