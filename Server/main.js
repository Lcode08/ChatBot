// Import necessary modules
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.json()); // Also parse JSON request bodies (optional, can be removed)

// Health check route
app.get('/', (req, res) => {
    res.send("Hello world! Gemini"); // Simple response for root route
});

// Define port for the server
const PORT = process.env.PORT || 8000;

// Initialize Google Generative AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate content based on the provided prompt
const generateContent = async (prompt) => {
    try {
        const result = await model.generateContent(prompt); // Generate content
        return result.response.text(); // Return the generated text
    } catch (err) {
        console.error(err); // Log any errors that occur
        throw new Error("Content generation failed."); // Throw an error for handling in the route
    }
};

// API endpoint to handle content generation requests
app.post('/api/content', async (req, res) => {
    try {
        const question = req.body.question; // Extract question from request body
        const result = await generateContent(question); // Generate content
        res.send({ result }); // Send back the generated result
    } catch (err) {
        res.status(500).send({ error: "Error: " + err.message }); // Send error response
    }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`); // Log server start message
});
