const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'KAARAN Offline Backend Active' });
});

app.post('/api/ai/diagnose', async (req, res) => {
  const { schemeName, rejectionReason } = req.body;

  try {
    const prompt = `You are KAARAN AI Assistant for Indian Government Farmer and Welfare Schemes.
Target Scheme: ${schemeName}
Rejection/Issue: ${rejectionReason}

Provide a concise, practical, step-by-step fix in 3 short bullet points in simple Hinglish so a farmer can understand quickly.`;

    // Local Ollama Call (Bina Internet ke chalega)
    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: 'gemma:2b',
      prompt: prompt,
      stream: false
    });

    res.json({ success: true, analysis: response.data.response });
  } catch (error) {
    console.error('Ollama Error:', error.message);
    
    // Instant Fallback (Emergency Offline Mode)
    const fallbackResponse = `1. **NPCI & Aadhaar Seeding Active Karein:** Apne Bank branch jaakar Aadhaar-NPCI mapping form submit karein.
2. **Document & Land Record Verification:** State Land Revenue portal par Khasra/Khatauni verification status verify karein.
3. **Kisan Helpdesk Portal Contact:** District Agriculture Office ya CSC Center par physical document verification karayein.`;

    res.json({ 
      success: true, 
      analysis: `[Offline Fallback Active]\n\n${fallbackResponse}` 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 KAARAN Offline Backend running on http://localhost:${PORT}`);
});