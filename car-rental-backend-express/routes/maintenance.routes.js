const express = require('express');
const router = express.Router();
const { addMaintenanceLog, getMaintenanceLogsForCar } = require('../controllers/maintenance.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// POST /api/maintenance/:carId - Add a maintenance log for a car
router.post('/:carId', protect, admin, addMaintenanceLog);

// GET /api/maintenance/:carId - Get all maintenance logs for a car
router.get('/:carId', protect, admin, getMaintenanceLogsForCar);

module.exports = router;
