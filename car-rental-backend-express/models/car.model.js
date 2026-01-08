const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  specifications: { type: [String], required: true },
  totalKilometers: { type: Number, required: true },
  kilometersSinceLastMaintenance: { type: Number, default: 0 },
  lastMaintenanceDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['AVAILABLE', 'RESERVED', 'MAINTENANCE'],
    default: 'AVAILABLE',
  },
  image: { type: String },
  currentLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
