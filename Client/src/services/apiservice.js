// src/services/apiService.js
import axios from 'axios';

// Use local server for development, deployed server for production
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://chatbot-l9s2.onrender.com/api/content' 
  : 'http://localhost:8000/api/content';

// parameter passed as a question and will now recieve the response in promise<string>
export const fetchContent = async (question) => {
    try {
        const response = await axios.post(API_URL, { question });
        
        // Check if response has the expected structure
        if (response.data && response.data.result) {
            return response.data.result;
        } else {
            console.error('Unexpected response structure:', response.data);
            throw new Error('Invalid response format from server');
        }
    } catch (error) {
        console.error("Error fetching content:", error);
        
        // Provide more detailed error information
        if (error.response) {
            // Server responded with error status
            console.error('Server Error:', error.response.status, error.response.data);
            throw new Error(`Server Error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`);
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network Error:', error.request);
            throw new Error('Network Error: Unable to connect to server');
        } else {
            // Something else happened
            console.error('Request Error:', error.message);
            throw new Error(`Request Error: ${error.message}`);
        }
    }
};


