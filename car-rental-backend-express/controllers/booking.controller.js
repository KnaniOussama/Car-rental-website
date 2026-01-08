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

    // Check if the car is available before allowing a booking
    if (car.status !== 'AVAILABLE') {
      return res.status(400).json({ message: 'This car is not available for booking.' });
    }
    
    // In a real-world scenario, you would also check for car availability for the selected dates.
    // This is a complex feature, so we'll omit it for now as per the project scope.

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

    // After booking is successful, update the car's status
    car.status = 'RESERVED';
    await car.save();

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
