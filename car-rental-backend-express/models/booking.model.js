const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  options: {
    driver: { type: Boolean, default: false },
    fuel: { type: Boolean, default: false },
    infantSeat: { type: Boolean, default: false },
  },
  insurance: {
    type: String,
    enum: ['full', 'basic', 'none'],
    required: true,
  },
  status: {
    type: String,
    enum: ['CONFIRMED', 'CANCELLED'],
    default: 'CONFIRMED',
  },
  // Include user details for easier display on the admin panel
  userDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    dateOfBirth: { type: String },
    country: { type: String },
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
