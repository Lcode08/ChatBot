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
    <div className={`prompt-area w-full sm:relative sm:bottom-0 lg:fixed flex items-center justify-center bg-gray-800 p-2 sm:p-2 lg:p-4 border-t border-gray-700 ${sessionActive ? 'bottom-0' : 'mb-20 bottom-4'}`}>
      
      {/* Button to toggle voice recognition */}
      <button
        onClick={toggleListening}
        className={`bg-blue-500 p-2 sm:h-10 sm:w-10 lg:h-14 lg:w-14 flex items-center justify-center rounded-l-lg text-white hover:bg-blue-600 transition-all duration-300 ${isListening ? "bg-red-500" : ""}`}
      >
        {/* Switch between microphone and stop icons based on listening state */}
        {isListening ? <FaStop className="sm:h-5 sm:w-5 lg:h-7 lg:w-7"/> : <FaMicrophone className="sm:h-5 sm:w-5 lg:h-7 lg:w-7" />}
      </button>

      {/* Text input for the prompt */}
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-2/3 p-2 sm:p-2 lg:p-4 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ask Something...."
      />

      {/* Button to send the prompt */}
      <button
        onClick={handleSend}
        className="bg-blue-500 p-2 sm:h-10 sm:w-10 lg:h-14 lg:w-14 rounded-r-lg text-white hover:bg-blue-600 transition-all duration-300"
      >
        <img src={sendImg} alt="Send" className="sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
      </button>

      {/* End session button, shown only if the session is active */}
      {sessionActive && (
        <button
          onClick={endSession}
          className="bg-red-500 p-2 sm:text-base sm:p-2 lg:text-xl lg:p-3 text-white ml-4 rounded-lg hover:bg-red-600 focus:outline-none transition-all duration-300"
        >
          End Session
        </button>
      )}
    </div>
  );
}

export default PromptArea;
