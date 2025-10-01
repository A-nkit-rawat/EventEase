const express = require('express');
const { createEvent, updateEvent, deleteEvent } = require('../controllers/adminController.js');
const{getAllEvents,getEvent}=require('../controllers/userController.js');
const router = express.Router();

router.post('/events', createEvent);
router.get('/events', getAllEvents);
router.get('/events/:eventId', getEvent);
router.patch('/events/:eventId', updateEvent);
router.delete('/events/:eventId', deleteEvent);

module.exports = router;