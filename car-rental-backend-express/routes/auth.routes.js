const express = require('express');
const { login, register } = require('../controllers/auth.controller');
const validationMiddleware = require('../middleware/validation.middleware');
const { loginSchema, registerSchema } = require('../validators/auth.validator');

const router = express.Router();

router.post('/login', validationMiddleware(loginSchema), login);
router.post('/register', validationMiddleware(registerSchema), register);

module.exports = router;
