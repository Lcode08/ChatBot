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

let model; // Will store the selected model

// Function to initialize the model dynamically
const initializeModel = async () => {
    try {
        console.log("📌 Fetching available models...");
        const result = await genAI.listModels();

        if (!result.models || result.models.length === 0) {
            console.error("❌ No models available for this API key");
            process.exit(1);
        }

        console.log("✅ Available models:");
        result.models.forEach((m, i) => console.log(`${i + 1}. ${m.name} - ${m.description || ''}`));

        // Pick the first model that supports generateContent
        model = result.models.find(m => m.supported_methods && m.supported_methods.includes("generateContent"));

        if (!model) {
            console.error("❌ No model supports generateContent. Cannot proceed.");
            process.exit(1);
        }

        console.log(`✅ Using model: ${model.name} for content generation`);
    } catch (err) {
        console.error("❌ Error fetching models:", err.message);
        process.exit(1);
    }
};

// Function to generate content
const generateContent = async (prompt) => {
    if (!model) throw new Error("Model not initialized");

    try {
        const generativeModel = genAI.getGenerativeModel({ model: model.name });
        const result = await generativeModel.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error("❌ Gemini API Error:", err);
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

// Start server and initialize model
app.listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}...`);
    await initializeModel(); // Fetch models and select one
});
