const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  activityType: {
    type: String,
    enum: [
      'CAR_CREATED',
      'CAR_UPDATED',
      'STATUS_CHANGED',
      'MAINTENANCE_COMPLETED',
      'REPORT_ADDED',
      'CAR_DELETED',
      'ENGINE_STARTED',
      'ENGINE_STOPPED',
      'DOOR_OPENED',
      'DOOR_CLOSED',
      'PASSENGER_DOOR_OPENED',
      'TRUNK_OPENED',
      'BONNET_OPENED',
      'HIGH_TEMPERATURE',
      'SPEED_EXCEEDED',
      'SUDDEN_BRAKING',
      'LOW_FUEL',
      'LOW_BATTERY',
      'HIGH_RPM',
    ],
    required: true,
  },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
