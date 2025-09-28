import React from 'react';
import { FiMenu, FiMessageSquare } from 'react-icons/fi';

function MobileHeader({ toggleSidebar, currentChatTitle }) {
  return (
    <div className="lg:hidden bg-gray-900 text-white p-4 border-b border-gray-700 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FiMenu size={20} />
        </button>
        
        <div className="flex items-center gap-2 flex-1 justify-center">
          <FiMessageSquare size={18} />
          <h1 className="font-semibold truncate max-w-48">
            {currentChatTitle || 'ChatBot'}
          </h1>
        </div>
        
        <div className="w-10" /> {/* Spacer for centering */}
      </div>
    </div>
  );
}

export default MobileHeader;