import React, { useState, useEffect, useRef } from "react";
import aiImg from "../Assets/Ai.png"; // AI avatar image
import userImg from "../Assets/User.png"; // User avatar image
import loadingGif from "../Assets/loading.gif"; // Loading GIF for AI responses
import { FaVolumeUp, FaCopy, FaStop } from 'react-icons/fa'; // Icons for audio, copy, and stop actions
import toast from 'react-hot-toast'; // Toast notifications for feedback

// Utility function to format AI response messages
function formatMessageText(text) {
  const lines = text.split("\n"); // Split text by line breaks

  return (
    <div>
      {lines.map((line, index) => {
         // Render different HTML elements based on the line's prefix
        if (line.startsWith("##")) {
          return (
            <h2 key={index} className="text-xl font-semibold mb-2">
              {line.replace("##", "").trim()} {/* Remove prefix and trim whitespace */}
            </h2>
          );
        } else if (line.startsWith("-")) {
          return (
            <ul key={index} className="list-disc list-inside ml-4">
              <li>{line.replace("-", "").trim()}</li> {/* Render list items */}
            </ul>
          );
        } else {
          return (
            <p key={index} className="mb-2">
              {line.trim()} {/* Render regular paragraphs */}
            </p>
          );
        }
      })}
    </div>
  );
}

function ChatBox({ messages }) {
  const [utterance, setUtterance] = useState(null); // State to track the speech utterance
  const messagesEndRef = useRef(null); // Reference to scroll to bottom

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to speak the AI response
  const speakAIResponse = (text) => {
    const newUtterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.lang === "en-IN" || voice.lang === "en-US"); // Select Indian English voice

    // If the selected voice is found, assign it to the utterance
    if (selectedVoice) {
      newUtterance.voice = selectedVoice;
    } else {
      console.warn("Indian English voice not found, using default."); // Fallback to default voice
    }

    window.speechSynthesis.speak(newUtterance); // Speak the text
    setUtterance(newUtterance); // Save the utterance for stopping later
  };

  // Function to stop any ongoing speech
  const stopSpeaking = () => {
    if (utterance) {
      window.speechSynthesis.cancel(); // Stop speech synthesis
      setUtterance(null); // Clear the utterance state
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text) // Use the Clipboard API to copy text
      .then(() => {
        toast.success('Copied to clipboard!'); // Show success toast
      })
      .catch((error) => {
        toast.error('Failed to copy text'); // Show error toast if copy fails
        console.error('Could not copy text: ', error); // Log error to console
      });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 ${
              message.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Display avatar based on the sender */}
            <div className="flex-shrink-0">
              <img
                src={message.sender === "user" ? userImg : aiImg}
                alt={message.sender === "user" ? "User Icon" : "AI Icon"}
                className={`w-10 h-10 rounded-full transition-transform duration-300 ${
                  message.sender === "user"
                    ? "border-2 border-blue-500 bg-white hover:shadow-lg hover:scale-105"
                    : "border-2 border-blue-200 bg-white hover:shadow-xl hover:scale-105"
                }`}
                style={{
                  boxShadow: message.sender === "user"
                    ? "0px 0px 8px rgba(59, 130, 246, 0.4)"   // Blue shadow for the user
                    : "0px 0px 8px rgba(34, 197, 94, 0.4)" // Green shadow for the AI
                }}
              />
            </div>

            {/* Message Box */}
            <div
              className={`flex-1 max-w-[80%] ${
                message.sender === "user"
                  ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3"
                  : "bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3"
              } shadow-sm`}
            >
              {message.loading ? (
                <div className="flex items-center justify-center py-2">
                  <img src={loadingGif} className="w-8 h-8" alt="Loading..." />
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="text-base leading-relaxed">
                    {formatMessageText(message.text)}
                  </div>

                  {/* Icons for audio, stop, and copy actions */}
                  {message.sender === "ai" && (
                    <div className="flex space-x-3 mt-3 pt-2 border-t border-gray-200">
                      <button
                        onClick={() => speakAIResponse(message.text)}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        title="Read Aloud"
                      >
                        <FaVolumeUp className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={stopSpeaking}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-red-100 transition-colors"
                        title="Stop"
                      >
                        <FaStop className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(message.text)}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-blue-100 transition-colors"
                        title="Copy"
                      >
                        <FaCopy className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default ChatBox;
