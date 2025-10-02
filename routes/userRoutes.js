const express = require('express');
const {getAllEvents,getEvent,bookEvent,cancelEvent} = require('../controllers/userController.js');
const router=express.Router();
const {protect, authorize}=require('../middlewares/authMiddleware.js');

/**
 * @swagger
 * user/events:
 *   get:
 *     summary: Get all events (user view)
 *     tags: [User Events]
 *     responses:
 *       200:
 *         description: List of all events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */
router.get("/events",getAllEvents);

/**
 * @swagger
 * user/events/{eventId}:
 *   get:
 *     summary: Get event details by eventId (user view)
 *     tags: [User Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/events/:eventID",protect,authorize('user'),getEvent)

/**
 * @swagger
 * user/book/{eventId}:
 *   post:
 *     summary: Book an event
 *     tags: [User Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       201:
 *         description: Event booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Booking failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/booking/:eventId",protect,authorize('user'),bookEvent);

/**
 * @swagger
 * user/cancel/{bookingId}:
 *   post:
 *     summary: Cancel a booking
 *     tags: [User Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Cancellation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/booking/cancel/:bookingId",protect,authorize('user'),cancelEvent);

module.exports=router;