const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const client = new Anthropic(); // uses ANTHROPIC_API_KEY env var

// AI proxy endpoint — no API key exposed to frontend
app.post('/api/chat', async (req, res) => {
  try {
    const { system, messages } = req.body;
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system,
      messages
    });
    res.json({ content: response.content });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PythonVerse online em http://localhost:${PORT}`));
