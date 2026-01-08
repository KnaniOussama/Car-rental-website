const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validation.middleware');
const { loginSchema } = require('../validators/auth.validator');

router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
