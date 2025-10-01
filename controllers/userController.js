const Event = require('../models/event.js');
const Booking = require('../models/booking.js');
const User = require('../models/user.js');

const getAllEvents = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Optional filters
    const from = req.query.from;
    const to = req.query.to;
    const filters = { eventDate: { $gte: new Date() } };
    if (!from && !to) {
      filters = { eventDate: { $gte: from, $lte: to } };
    }
    if (req.query.category) {
      filters.eventCategory = req.query.category;
    }

    if (req.query.location) {
      filters.eventLocation = req.query.location;
    }

    // Get total count for pagination metadata
    const totalEvents = await Event.countDocuments(filters);

    // Fetch paginated events
    const events = await Event.find(filters)
      .sort({ event_date: 1 })
      .skip(skip)
      .limit(limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalEvents / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalEvents: totalEvents,
        eventsPerPage: limit,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};


const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json(
        {
          success: false,
          message: 'Event not found',
          error: error.message
        }
      );
    }
    res.status(200).json(
      {
        success: true,
        data: event
      }
    );
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
}

// const session = await mongoose.startSession();
// session.startTransaction();

const bookEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const Event = await Event.findById(eventId);
    if (!Event) {
      return res.status(404).json(
        {
          success: false,
          message: 'Event not found',
          error: error.message
        }
      );
    }
    const user = User.find({ email: req.email });
    if (!user) {
      return res.status(404).json(
        {
          success: false,
          message: 'User not found',
          error: error.message
        }
      );
    }
    const userId = user._id;
    let userBookings = await Booking.countDocuments({
      userId,
      eventId,
      status: 'confirmed'
    });

    if (userBookings >= 2) {
      return res.status(400).json({
        success: false,
        message: 'You have already made 2 bookings for this event'
      });
    }
    const totalBookings = await Booking.countDocuments({
      eventId,
      status: 'confirmed'
    });

    if (totalBookings >= Event.eventSeats) {
      return res.status(400).json({
        success: false,
        message: 'No seats available for this event'
      });
    }
    const booking = await Booking.create({
      userId,
      eventId
    });
    if(booking){
      res.status(201).json({
      success: true,
      message: 'Event booked successfully',
      data: booking
    });
    }
    else{
      res.status(500).json({
        success: false,
        message: 'Error booking event',
        error: error.message
      })
    }
    
    
  }
    catch (error) {

    }
  }
  // cancel booking
const cancelEvent = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { userId } = req.body;

    // Find the booking
    const booking = await Booking.findOne({
      _id: bookingId,
      userId: userId
    }).populate('event_id');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking already cancelled'
      });
    }

    // Check if event has started
    if (new Date() >= new Date(booking.eventId.eventDate)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking for event that has already started'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

module.exports = { getAllEvents, getEventById, bookEvent, cancelEvent };

