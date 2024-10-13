import React from "react";
import logoAI from "../Assets/logoAI.png"; // Importing the AI logo image

function Header() {
  return (
    <div className="container flex flex-col items-center text-center py-12 animate-fadeIn">
      {/* Main Heading */}
      <h1 className="text-transparent bg-clip-text text-7xl sm:text-9xl bg-gradient-to-r from-white via-cyan-300 to-pink-700 font-bold mb-4">
        Hello There!
      </h1>

      {/* Subheading */}
      <h2 className="text-2xl sm:text-3xl text-gray-400 mt-2 animate-bounce">
        Talk to your Own AI Assistant
      </h2>

      {/* AI Logo Image */}
      <img
        src={logoAI}
        className="h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] mt-5 rounded-full border-4 border-white shadow-lg transition-transform duration-300 hover:scale-105"
        alt="AI Logo" // Alt text for accessibility
      />
    </div>
  );
}

export default Header;
