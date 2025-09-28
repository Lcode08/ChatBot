// Import necessary modules
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://chat-bot-by-lokesh.vercel.app',
            'http://localhost:3000', // For local development
            'http://127.0.0.1:3000'  // Alternative localhost
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
})); 
app.use(express.json()); // Parse JSON request bodies

// Health check route
app.get('/', (req, res) => {
    res.send("Hello world! Gemini is running ✅");
});

// Define port
const PORT = process.env.PORT || 8000;

// Debug: Check if API key is loaded
console.log('API_KEY loaded:', process.env.API_KEY ? 'Yes (length: ' + process.env.API_KEY.length + ')' : 'No');
console.log('PORT:', PORT);

// Initialize Google Generative AI with API key
if (!process.env.API_KEY) {
    console.error('❌ ERROR: API_KEY not found in environment variables');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Pick a valid model (gemini-1.5-pro OR gemini-1.5-flash)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Function to list available models
const listModels = async () => {
    try {
        console.log("📌 Fetching available Gemini models...");
        const result = await genAI.listModels();
        if (result.models && result.models.length > 0) {
            console.log("✅ Available models:");
            result.models.forEach((m, i) => {
                console.log(`${i + 1}. ${m.name}`);
            });
        } else {
            console.log("⚠️ No models found.");
        }
    } catch (err) {
        console.error("❌ Error fetching models:", err.message);
    }
};

// Function to generate content
const generateContent = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error('❌ Gemini API Error:', err);
        throw new Error(`Content generation failed: ${err.message}`);
    }
};

// API endpoint
app.post('/api/content', async (req, res) => {
    try {
        const question = req.body.question;

        if (!question || typeof question !== 'string' || question.trim() === '') {
            return res.status(400).send({ error: "Question is required and must be a non-empty string" });
        }

        const result = await generateContent(question);
        res.send({ result });
    } catch (err) {
        console.error('❌ Error in /api/content:', err.message);
        res.status(500).send({ error: "Error: " + err.message });
    }
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}...`);
    await listModels(); // List models when server starts
});
