const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
 const PORT = process.env.PORT || 10000; // Render requires dynamic port binding
app.listen(PORT, '0.0.0.0', () => {    // '0.0.0.0' is crucial for Render
  console.log(`Server running on port ${PORT}`);
});

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    console.log('Request received. Attempting to call DeepSeek API...');
    console.log('Using API Key:', process.env.DEEPSEEK_API_KEY ? '*** (exists)' : 'MISSING!');

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-v3',
        messages: req.body.messages,
        max_tokens: 300,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000 // 5-second timeout
      }
    );

    console.log('DeepSeek API response:', response.status);
    res.json(response.data);
  } catch (error) {
    console.error('FULL ERROR DETAILS:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'DeepSeek API failed',
      details: error.message 
    });
  }
});
