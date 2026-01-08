const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  description: { type: String, required: true },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'LOW',
  },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
