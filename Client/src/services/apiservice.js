// src/services/apiService.js
import axios from 'axios';

const API_URL = 'https://chatbot-l9s2.onrender.com/api/content'; // Update with your server URL if needed

// parameter passed as a question and will now recieve the response in promise<string>
export const fetchContent = async (question) => {
    try {
        const response = await axios.post(API_URL, { question });
        console.log(response)
        return response.data.result; // Assuming your backend sends the result in this format
    } catch (error) {
        console.error("Error fetching content:", error);
        throw error; // Rethrow the error to handle it in the calling component
    }
};


