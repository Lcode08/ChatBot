import React, { useState } from "react";
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
    <div className="chat-container w-full max-h-[calc(100vh-120px)] overflow-y-auto flex flex-col gap-5 p-5">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-start ${
            message.sender === "user" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {/* Display avatar based on the sender */}
          <img
            src={message.sender === "user" ? userImg : aiImg}
            alt={message.sender === "user" ? "User Icon" : "AI Icon"}
            className={`w-16 h-16 rounded-full mx-4 my-4 transition-transform duration-300 p-0.5 ${
              message.sender === "user"
                ? "border-4 border-blue-500 bg-white hover:shadow-lg hover:scale-105"
                : "border-4 border-blue-200 bg-white hover:shadow-xl hover:scale-105"
            }`}
            style={{
              boxShadow: message.sender === "user"
                ? "0px 0px 10px rgba(0, 0, 255, 0.5)"   // Blue shadow for the user
                : "0px 0px 10px rgba(0, 255, 255, 0.5)" // Cyan shadow for the AI
            }}
          />

          {/* Message Box */}
          <div
            className={`flex ${
              message.sender === "user"
                ? "bg-blue-500 text-white rounded-[30px_30px_0_30px] ml-auto max-w-[700px] px-5 py-3"
                : "bg-blue-300 text-gray-800 rounded-[30px_30px_30px_0] max-w-[800px] px-5 py-3"
            } text-xl shadow-md`}
          >
            {message.loading ? (
              <img src={loadingGif} className="w-11 h-11" alt="Loading..." /> // Show loading GIF while processing
            ) : (
              <div className="flex flex-col">
                {formatMessageText(message.text)}  {/* Format and display AI response text */}

                {/* Icons for audio, stop, and copy actions */}
                {message.sender === "ai" && (
                  <div className="flex space-x-2 mt-2">
                    <FaVolumeUp
                      className="cursor-pointer text-blue-500 hover:text-blue-700"
                      onClick={() => speakAIResponse(message.text)} // Trigger text-to-speech
                      title="Read Aloud"
                    />
                    <FaStop
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      onClick={stopSpeaking} // Stop speech synthesis
                      title="Stop"
                    />
                    <FaCopy
                      className="cursor-pointer text-blue-500 hover:text-blue-700"
                      onClick={() => copyToClipboard(message.text)} // Copy message text to clipboard
                      title="Copy"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatBox;
