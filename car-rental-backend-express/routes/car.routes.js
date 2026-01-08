const express = require('express');
const router = express.Router();
const carController = require('../controllers/car.controller');
const validate = require('../middleware/validation.middleware');
const { createCarSchema, updateCarSchema, carStatusSchema } = require('../validators/car.validator');
const { createReportSchema } = require('../validators/report.validator');
const { protect, admin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', carController.getAvailableCars);

// Admin routes
router.post('/',  protect, admin, validate(createCarSchema), carController.createCar);
router.get('/admin', protect, admin, carController.getAllCars);
router.get('/stats', protect, admin, carController.getCarStats);
router.get('/:id', carController.getCarById);
router.put('/:id', protect, admin, validate(updateCarSchema), carController.updateCar);
router.delete('/:id', protect, admin, carController.deleteCar);
router.put('/:id/status', protect, admin, validate(carStatusSchema), carController.updateCarStatus);
router.put('/:id/simulate-location', protect, admin, carController.simulateLocationUpdate);
router.post('/:id/reports', protect, admin, validate(createReportSchema), carController.addReport);
router.get('/:id/reports', protect, admin, carController.getReportsByCarId);
router.get('/:id/activity-logs', protect, admin, carController.getActivityLogsByCarId);

module.exports = router;
