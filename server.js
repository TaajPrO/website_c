const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/auto';

if (!OPENROUTER_API_KEY) {
  console.warn('WARNING: OPENROUTER_API_KEY not set. Put your key in a .env file (see .env.example).');
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple health route
app.get('/api/health', (req, res) => {
  res.json({ ok: true, env_model: OPENROUTER_MODEL });
});

// Proxy route to OpenRouter chat completions
app.post('/api/chat', async (req, res) => {
  try {
    const body = req.body || {};
    const messages = body.messages || [];
    const model = body.model || OPENROUTER_MODEL;

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'Server missing OPENROUTER_API_KEY. See .env.example' });
    }

    const payload = {
      model,
      messages,
      // you can add other parameters like temperature, max_tokens here if you want
    };

    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + OPENROUTER_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();
    // forward status code from OpenRouter if it's an error
    if (!resp.ok) {
      return res.status(resp.status).json(data);
    }

    // The OpenRouter response shape is similar to OpenAI's chat completions:
    // { choices: [ { message: { role, content } } ], ... }
    res.json(data);
  } catch (err) {
    console.error('Error in /api/chat', err);
    res.status(500).json({ error: String(err) });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
