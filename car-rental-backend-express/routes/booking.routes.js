const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings } = require('../controllers/booking.controller');
const validationMiddleware = require('../middleware/validation.middleware');
const { createBookingSchema } = require('../validators/booking.validator');
const { protect, admin } = require('../middleware/auth.middleware');

// POST /api/bookings - Create a new booking (requires user authentication)
router.post('/', protect, validationMiddleware(createBookingSchema), createBooking);

// GET /api/bookings/admin - Get all bookings (requires admin authentication)
router.get('/admin', protect, admin, getAllBookings);

module.exports = router;
