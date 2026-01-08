const axios = require('axios');

// @desc    Handle chatbot prompt
// @route   POST /api/chatbot
// @access  Public
exports.handleChat = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'A prompt is required.' });
  }

  try {

    const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
      model: "llama3.2", //gemma:2b
      prompt: `You are a helpful car rental assistant. The user is asking: "${prompt}". Keep your answer concise and helpful.`,
      stream: false
    });

    res.json({
      reply: ollamaResponse.data.response 
    });

  } catch (error) {
    console.error('Error contacting Ollama API:', error.message);
    res.status(500).json({ message: 'There was an error communicating with the AI assistant.' });
  }
};
