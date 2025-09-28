import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiMessageSquare, FiTrash2, FiMenu, FiX } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';

function Sidebar({ 
  onNewChat, 
  onSelectChat, 
  currentChatId, 
  chatHistory, 
  onDeleteChat,
  isSidebarOpen,
  toggleSidebar 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredChats(chatHistory);
    } else {
      const filtered = chatHistory.filter(chat =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.messages.some(msg => 
          msg.text && msg.text.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredChats(filtered);
    }
  }, [searchTerm, chatHistory]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const truncateTitle = (title, maxLength = 25) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-gray-900 text-white z-50 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-80 flex flex-col border-r border-gray-700
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">ChatBot</h2>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          
          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiPlus size={18} />
            <span>New chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search chats"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <FiMessageSquare size={16} />
              Recent Chats
            </h3>
            
            {filteredChats.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <FiMessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                <p>No chats found</p>
                <p className="text-sm mt-1">Start a new conversation</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`
                      group relative p-3 rounded-lg cursor-pointer transition-colors
                      ${currentChatId === chat.id 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'hover:bg-gray-800'
                      }
                    `}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1 truncate">
                          {truncateTitle(chat.title)}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {formatDate(chat.lastUpdated)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {chat.messages.length} messages
                        </p>
                      </div>
                      
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-all"
                        title="Delete chat"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <FaUser size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">AI Assistant</p>
              <p className="text-xs text-gray-400">Ready to help</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;