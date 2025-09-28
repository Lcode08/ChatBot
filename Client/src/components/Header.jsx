import React from "react";
import logoAI from "../Assets/logoAI.png"; // Importing the AI logo image

function Header() {
  return (
    <div className="flex flex-col items-center text-center py-8 px-4 animate-fadeIn">
      {/* Main Heading */}
      <h1 className="text-transparent bg-clip-text text-4xl sm:text-6xl lg:text-7xl bg-gradient-to-r from-white via-cyan-300 to-pink-700 font-bold mb-4">
        Hello There!
      </h1>

      {/* Subheading */}
      <h2 className="text-lg sm:text-xl lg:text-2xl text-gray-400 mt-2 mb-6">
        Talk to your Own AI Assistant
      </h2>

      {/* AI Logo Image */}
      <img
        src={logoAI}
        className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 rounded-full border-4 border-white shadow-lg transition-transform duration-300 hover:scale-105"
        alt="AI Logo"
      />
    </div>
  );
}

export default Header;
