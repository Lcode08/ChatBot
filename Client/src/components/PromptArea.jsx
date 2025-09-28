import React, { useState, useEffect } from "react";
import sendImg from '../Assets/send.svg';
import { FaMicrophone, FaStop } from 'react-icons/fa'; // Voice control icons

function PromptArea({ sendMessage, endSession, sessionActive }) {
  const [prompt, setPrompt] = useState(""); // Stores the user's input
  const [isListening, setIsListening] = useState(false); // Tracks speech recognition status
  const [recognition, setRecognition] = useState(null); // SpeechRecognition instance

  useEffect(() => {
    // Set up SpeechRecognition API if supported by the browser
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.interimResults = true; // Provides partial results as user speaks

      recognitionInstance.onstart = () => setIsListening(true); // Start listening
      recognitionInstance.onend = () => setIsListening(false); // Stop listening when recognition ends

      // Handle the speech recognition results
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript); // Update the prompt with recognized speech
      };

      setRecognition(recognitionInstance); // Store the recognition instance
    } else {
      console.error("Speech Recognition not supported in this browser.");
    }
  }, []);

  // Handles sending the prompt if it's not empty
  const handleSend = () => {
    if (prompt.trim()) {
      sendMessage(prompt); // Call the sendMessage function passed via props
      setPrompt(""); // Clear the input field
    }
  };

  // Handle Enter key press in the input field
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission if inside a form
      handleSend(); // Trigger the send function
    }
  };

  // Toggles speech recognition on or off
  const toggleListening = () => {
    if (isListening) {
      recognition.stop(); // Stop recognition if it's active
    } else {
      recognition.start(); // Start recognition if inactive
    }
  };

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          {/* Button to toggle voice recognition */}
          <button
            onClick={toggleListening}
            className={`p-3 h-12 w-12 flex items-center justify-center rounded-lg text-white transition-all duration-300 ${
              isListening ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-gray-500"
            }`}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {/* Switch between microphone and stop icons based on listening state */}
            {isListening ? <FaStop className="h-4 w-4"/> : <FaMicrophone className="h-4 w-4" />}
          </button>

          {/* Text input for the prompt */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-3 h-12 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-0 pr-12"
              placeholder="Message ChatBot..."
            />
            
            {/* Send button inside input */}
            <button
              onClick={handleSend}
              disabled={!prompt.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-300 ${
                prompt.trim() 
                  ? "bg-blue-500 hover:bg-blue-600 text-white" 
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
              title="Send message"
            >
              <img src={sendImg} alt="Send" className="w-4 h-4" />
            </button>
          </div>

          {/* End session button, shown only if the session is active */}
          {sessionActive && (
            <button
              onClick={endSession}
              className="bg-gray-600 hover:bg-gray-500 px-4 py-3 text-white rounded-lg focus:outline-none transition-all duration-300 text-sm font-medium"
              title="Start new chat"
            >
              New Chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PromptArea;
