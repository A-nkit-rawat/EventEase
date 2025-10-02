const express = require('express');
const {getAllEvents,getEvent,bookEvent,cancelEvent} = require('../controllers/userController.js');
const router=express.Router();
const {protect, authorize}=require('../middlewares/authMiddleware.js');

router.get("/events",getAllEvents);
router.get("/events/:eventID",protect,authorize('user'),getEvent)
router.post("/booking/:eventId",protect,authorize('user'),bookEvent);
router.post("/booking/cancel/:bookingId",protect,authorize('user'),cancelEvent);

module.exports=router;