const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserAdminStatus } = require('../controllers/user.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// GET /api/users/admin - Get all users (Admin only)
router.get('/admin', protect, admin, getAllUsers);

// PUT /api/users/admin/:id - Update a user's admin status (Admin only)
router.put('/admin/:id', protect, admin, updateUserAdminStatus);

module.exports = router;
