const express = require('express');
const {getAllEvents,getEvent,bookEvent,cancelEvent} = require('../controllers/userController.js');
const router=express.Router();

router.get("/events",getAllEvents);
router.get("/events/:eventID",getEvent)
router.post("/booking",bookEvent);
router.post("/booking/cancel/:bookingId",cancelEvent);

module.exports=router;