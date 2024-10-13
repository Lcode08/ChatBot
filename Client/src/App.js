import React, { useState } from "react";
import ChatBox from "./components/ChatBox";
import PromptArea from "./components/PromptArea";
import Header from "./components/Header";
import { fetchContent } from "./services/apiservice";
import { toast, Toaster } from "react-hot-toast";
import Footer from "./components/Footer";

function App() {
  // State to manage chat messages and session visibility
  const [messages, setMessages] = useState([]); // Store chat messages
  const [headerVisible, setHeaderVisible] = useState(true); // Track Header visibility
  const [sessionActive, setSessionActive] = useState(false); // Track if the chat session is active

  /**
   * Handle sending user messages.
   * @param {string} userMessage - The message entered by the user.
   */
  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return; // Do nothing if the message is empty

    // Hide the header and show the session active state
    setHeaderVisible(false);
    setSessionActive(true);

    const newMessages = [...messages, { sender: "user", text: userMessage }];
    setMessages(newMessages); // Update messages with the new user message

    // Show AI loading gif before fetching response
    setTimeout(() => {
      setMessages([...newMessages, { sender: "ai", loading: true }]); // Display loading message

      // Fetch AI response after a delay
      fetchAIResponse(userMessage, newMessages);
    }, 500);
  };

  /**
   * Fetch AI response using the API service.
   * @param {string} userMessage - The user's message to be sent to the API.
   * @param {Array} currentMessages - The current chat messages.
   */
  const fetchAIResponse = async (userMessage, currentMessages) => {
    try {
      const aiResponse = await fetchContent(userMessage); // Call the API service
      console.log(aiResponse); // Log the AI response for debugging

      // Update messages with the AI response
      const updatedMessages = [
        ...currentMessages,
        { sender: "ai", text: aiResponse.replace(/\*/g, "") }, // Clean up asterisks
      ];
      setMessages(updatedMessages);
    } catch (error) {
      // Handle error and update messages
      const updatedMessages = [
        ...currentMessages,
        { sender: "ai", text: "Error: Unable to fetch response." },
      ];
      setMessages(updatedMessages);
      console.error(error); // Log the error for debugging
    }
  };

  // Function to reset the chat session
  const endSession = () => {
    setMessages([]); // Clear all messages
    setHeaderVisible(true); // Show the header again
    setSessionActive(false); // Hide the "End Session" button
    toast.success('Session ended successfully!'); // Notify user
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center">
      {headerVisible && <Header />} {/* Render Header if visible */}
      <Toaster />
      <ChatBox messages={messages} /> {/* Display chat messages */}

      <PromptArea 
        sendMessage={sendMessage} 
        endSession={endSession} 
        sessionActive={sessionActive} 
      />

      {/* Render the footer only if session is inactive */}
      {!sessionActive && <Footer />}
    </div>
  );
}

export default App;