const express = require('express');
const { createEvent, updateEvent, deleteEvent } = require('../controllers/adminController.js');
const{getAllEvents,getEvent}=require('../controllers/userController.js');
const {protect,authorize}=require('../middlewares/authMiddleware.js');
const router = express.Router();

router.post('/events',protect,authorize('admin'), createEvent);
router.get('/events',protect,authorize('admin'), getAllEvents);
router.get('/events/:eventId',protect,authorize('admin') ,getEvent);
router.patch('/events/:eventId',protect,authorize('admin'), updateEvent);
router.delete('/events/:eventId',protect,authorize('admin'), deleteEvent);

module.exports = router;