const express = require('express');
const router = express.Router();
const carController = require('../controllers/car.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { createCarSchema, updateCarSchema, carStatusSchema } = require('../validators/car.validator');
const { createReportSchema } = require('../validators/report.validator');

// Public routes
router.get('/', carController.getAvailableCars);

// Admin routes
router.post('/', authMiddleware, validate(createCarSchema), carController.createCar);
router.get('/admin', authMiddleware, carController.getAllCars);
router.get('/stats', authMiddleware, carController.getCarStats);
router.get('/:id', authMiddleware, carController.getCarById);
router.put('/:id', authMiddleware, validate(updateCarSchema), carController.updateCar);
router.delete('/:id', authMiddleware, carController.deleteCar);
router.put('/:id/status', authMiddleware, validate(carStatusSchema), carController.updateCarStatus);
router.put('/:id/simulate-location', authMiddleware, carController.simulateLocationUpdate);
router.post('/:id/reports', authMiddleware, validate(createReportSchema), carController.addReport);
router.get('/:id/reports', authMiddleware, carController.getReportsByCarId);
router.get('/:id/activity-logs', authMiddleware, carController.getActivityLogsByCarId);

module.exports = router;
