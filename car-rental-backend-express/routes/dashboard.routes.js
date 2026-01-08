const express = require('express');
const router = express.Router();
const { getDashboardAnalytics } = require('../controllers/dashboard.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// GET /api/dashboard/analytics - Get all dashboard analytics data (Admin only)
router.get('/analytics', protect, admin, getDashboardAnalytics);

module.exports = router;
