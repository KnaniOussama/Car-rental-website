const mongoose = require('mongoose');
const { Schema } = mongoose;

const maintenanceLogSchema = new Schema({
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  cost: {
    type: Number,
    min: 0,
    default: 0,
  },
}, { timestamps: true });

const MaintenanceLog = mongoose.model('MaintenanceLog', maintenanceLogSchema);

module.exports = MaintenanceLog;
