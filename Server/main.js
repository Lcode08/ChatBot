// Import necessary modules
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Health check route
app.get('/', (req, res) => {
    res.send("Hello world! Gemini"); // Simple response for root route
});

// Test endpoint to check Gemini API
app.get('/test', async (req, res) => {
    try {
        const result = await generateContent("Say hello");
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Define port for the server
const PORT = process.env.PORT || 8000;

// Debug: Check if API key is loaded
console.log('API_KEY loaded:', process.env.API_KEY ? 'Yes (length: ' + process.env.API_KEY.length + ')' : 'No');
console.log('PORT:', PORT);

// Initialize Google Generative AI with API key from environment variables
if (!process.env.API_KEY) {
    console.error('ERROR: API_KEY not found in environment variables');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate content based on the provided prompt
const generateContent = async (prompt) => {
    try {
        console.log('Generating content for prompt:', prompt);
        const result = await model.generateContent(prompt); // Generate content
        const text = result.response.text(); // Return the generated text
        console.log('Generated text:', text);
        return text;
    } catch (err) {
        console.error('Gemini API Error:', err); // Log any errors that occur
        
        // Provide more specific error messages
        if (err.message.includes('API_KEY')) {
            throw new Error("Invalid API key. Please check your Gemini API key.");
        } else if (err.message.includes('quota')) {
            throw new Error("API quota exceeded. Please try again later.");
        } else if (err.message.includes('blocked')) {
            throw new Error("Content was blocked by safety filters.");
        } else {
            throw new Error(`Content generation failed: ${err.message}`);
        }
    }
};

// API endpoint to handle content generation requests
app.post('/api/content', async (req, res) => {
    try {
        console.log('Received request:', req.body);
        
        const question = req.body.question; // Extract question from request body
        
        // Validate input
        if (!question || typeof question !== 'string' || question.trim() === '') {
            return res.status(400).send({ error: "Question is required and must be a non-empty string" });
        }
        
        console.log('Processing question:', question);
        const result = await generateContent(question); // Generate content
        console.log('Generated result:', result);
        
        res.send({ result }); // Send back the generated result
    } catch (err) {
        console.error('Error in /api/content:', err);
        res.status(500).send({ error: "Error: " + err.message }); // Send error response
    }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`); // Log server start message
});
