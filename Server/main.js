const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://chat-bot-by-lokesh.vercel.app',
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello world! Gemini is running ✅");
});

const PORT = process.env.PORT || 8000;

if (!process.env.API_KEY) {
    console.error('ERROR: API_KEY not found in environment variables');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const MODEL_NAMES = [
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
    "gemini-1.5-flash",
    "gemini-1.5-pro", 
    "gemini-pro",
    "gemini-2.5-flash"
];

let model;

const initializeModel = async () => {
    for (const modelName of MODEL_NAMES) {
        try {
            model = genAI.getGenerativeModel({ model: modelName });
            const testResult = await model.generateContent("Hello");
            console.log(`Model initialized successfully: ${modelName}`);
            return;
        } catch (err) {
            console.log(`Model ${modelName} unavailable, trying next...`);
            continue;
        }
    }
    
    console.error("ERROR: No working model found. Please check your API key.");
    process.exit(1);
};

const generateContent = async (prompt) => {
    if (!model) throw new Error("Model not initialized");

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error("Gemini API Error:", err);
        throw new Error(`Content generation failed: ${err.message}`);
    }
};

app.post('/api/content', async (req, res) => {
    try {
        const question = req.body.question;

        if (!question || typeof question !== 'string' || question.trim() === '') {
            return res.status(400).send({ error: "Question is required and must be a non-empty string" });
        }

        const result = await generateContent(question);
        res.send({ result });
    } catch (err) {
        console.error('Error in /api/content:', err.message);
        res.status(500).send({ error: "Error: " + err.message });
    }
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await initializeModel();
});
