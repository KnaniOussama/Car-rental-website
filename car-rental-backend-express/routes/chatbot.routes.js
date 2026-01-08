const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatbot.controller');

// POST /api/chatbot - Handle a prompt from the user
router.post('/', handleChat);

module.exports = router;
