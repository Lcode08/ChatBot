import React, { useState, useEffect } from "react";
import ChatBox from "./components/ChatBox";
import PromptArea from "./components/PromptArea";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MobileHeader from "./components/MobileHeader";
import { fetchContent } from "./services/apiservice";
import { toast, Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import {
  getChatHistory,
  saveChat,
  deleteChat,
  createNewChat,
  getChatById,
  updateChatTitle
} from "./utils/chatStorage";

function App() {
  // State to manage chat messages and session visibility
  const [messages, setMessages] = useState([]); // Store chat messages
  const [headerVisible, setHeaderVisible] = useState(true); // Track Header visibility
  const [sessionActive, setSessionActive] = useState(false); // Track if the chat session is active
  
  // New state for chat history and sidebar
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentChatTitle, setCurrentChatTitle] = useState('');

  // Load chat history on component mount
  useEffect(() => {
    const history = getChatHistory();
    setChatHistory(history);
  }, []);

  // Auto-save current chat when messages change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      const chatData = {
        id: currentChatId,
        title: currentChatTitle,
        messages: messages,
        createdAt: Date.now(),
        lastUpdated: Date.now()
      };
      
      const updatedHistory = saveChat(chatData);
      setChatHistory(updatedHistory);
      
      // Update title after first user message
      if (messages.length === 1 && messages[0].sender === 'user') {
        updateChatTitle(currentChatId, messages);
        const firstUserMessage = messages[0].text;
        const newTitle = firstUserMessage.length > 50 
          ? firstUserMessage.substring(0, 50) + '...' 
          : firstUserMessage;
        setCurrentChatTitle(newTitle);
      }
    }
  }, [messages, currentChatId, currentChatTitle]);

  /**
   * Handle sending user messages.
   * @param {string} userMessage - The message entered by the user.
   */
  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return; // Do nothing if the message is empty

    // Create new chat if none exists
    if (!currentChatId) {
      const newChat = createNewChat(userMessage);
      setCurrentChatId(newChat.id);
      setCurrentChatTitle(newChat.title);
    }

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

  // Function to start a new chat
  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setCurrentChatTitle('');
    setHeaderVisible(true);
    setSessionActive(false);
    setIsSidebarOpen(false); // Close sidebar on mobile
    toast.success('New chat started!');
  };

  // Function to select an existing chat
  const handleSelectChat = (chatId) => {
    const chat = getChatById(chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chat.id);
      setCurrentChatTitle(chat.title);
      setHeaderVisible(chat.messages.length === 0);
      setSessionActive(chat.messages.length > 0);
      setIsSidebarOpen(false); // Close sidebar on mobile
    }
  };

  // Function to delete a chat
  const handleDeleteChat = (chatId) => {
    const updatedHistory = deleteChat(chatId);
    setChatHistory(updatedHistory);
    
    // If deleting current chat, start new one
    if (chatId === currentChatId) {
      handleNewChat();
    }
    
    toast.success('Chat deleted successfully!');
  };

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to reset the chat session (keep for backward compatibility)
  const endSession = () => {
    handleNewChat();
  };

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      <Toaster />
      
      {/* Sidebar */}
      <Sidebar
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId}
        chatHistory={chatHistory}
        onDeleteChat={handleDeleteChat}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <MobileHeader 
          toggleSidebar={toggleSidebar}
          currentChatTitle={currentChatTitle}
        />

        {/* Chat Content Area - This will take remaining space */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header (when visible) */}
          {headerVisible && <Header />}
          
          {/* Chat Messages Area - Scrollable */}
          <div className="flex-1 overflow-hidden">
            <ChatBox messages={messages} />
          </div>

          {/* Footer (when session is inactive) */}
          {!sessionActive && <Footer />}
        </div>

        {/* Fixed Input Area at Bottom */}
        <div className="flex-shrink-0">
          <PromptArea 
            sendMessage={sendMessage} 
            endSession={endSession} 
            sessionActive={sessionActive} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;