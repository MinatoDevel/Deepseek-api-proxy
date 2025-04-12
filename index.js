const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route - NEW ADDITION
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>DeepSeek API Proxy</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
        a { color: #0070f3; text-decoration: none; }
      </style>
    </head>
    <body>
      <h1>DeepSeek API Proxy Service</h1>
      <p>This proxy is successfully running on Render.</p>
      
      <h2>Available Endpoints</h2>
      <ul>
        <li><strong>GET /</strong> - This info page</li>
        <li><strong>GET /health</strong> - <a href="/health">Service health check</a></li>
        <li><strong>POST /chat</strong> - DeepSeek API endpoint</li>
      </ul>

      <h2>Usage Example</h2>
      <pre>curl -X POST https://${req.hostname}/chat \\
  -H "Content-Type: application/json" \\
  -d '{"messages": [{"role": "user", "content": "Hello!"}]}'</pre>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'Healthy',
    deepseekStatus: process.env.DEEPSEEK_API_KEY ? 'Configured' : 'Missing',
    timestamp: new Date().toISOString()
  });
});

// DeepSeek API proxy
app.post('/chat', async (req, res) => {
  try {
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
        timeout: 5000
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({ 
      error: 'DeepSeek API request failed',
      details: error.message 
    });
  }
});

// Start server - IMPORTANT: Use Render's required bind address
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
