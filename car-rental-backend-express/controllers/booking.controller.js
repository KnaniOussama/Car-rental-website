const { default: mongoose } = require('mongoose');
const Booking = require('../models/booking.model');
const Car = require('../models/car.model');
const User = require('../models/user.model');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (user)
exports.createBooking = async (req, res) => {
  try {
    const { car: carId, startDate, endDate, totalPrice, options, insurance, userDetails } = req.body;
    const userId = req.user.userId; // Extracted from JWT by auth middleware

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }
    

    const newBooking = new Booking({
      user: new mongoose.Types.ObjectId(userId),
      car: carId,
      startDate,
      endDate,
      totalPrice,
      options,
      insurance,
      userDetails,
    });

    await newBooking.save();

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings/admin
// @access  Private (admin)
exports.getAllBookings = async (req, res) => {
  try {

    const bookings = await Booking.find()
      .populate('car', 'brand model year price')
      .populate('user', 'email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
