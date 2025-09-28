// Chat storage utility for localStorage management

const STORAGE_KEY = 'chatbot_history';

// Generate unique ID for chats
export const generateChatId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generate chat title from first message
export const generateChatTitle = (firstMessage) => {
  if (!firstMessage || !firstMessage.trim()) return 'New Chat';
  
  // Clean and truncate the message for title
  const cleanMessage = firstMessage.trim().replace(/\n/g, ' ');
  return cleanMessage.length > 50 ? cleanMessage.substring(0, 50) + '...' : cleanMessage;
};

// Get all chat history from localStorage
export const getChatHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

// Save chat history to localStorage
export const saveChatHistory = (chatHistory) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

// Get specific chat by ID
export const getChatById = (chatId) => {
  const history = getChatHistory();
  return history.find(chat => chat.id === chatId);
};

// Save or update a specific chat
export const saveChat = (chatData) => {
  const history = getChatHistory();
  const existingIndex = history.findIndex(chat => chat.id === chatData.id);
  
  const chatToSave = {
    ...chatData,
    lastUpdated: Date.now()
  };
  
  if (existingIndex >= 0) {
    // Update existing chat
    history[existingIndex] = chatToSave;
  } else {
    // Add new chat to beginning of array
    history.unshift(chatToSave);
  }
  
  // Keep only last 50 chats to prevent localStorage overflow
  const trimmedHistory = history.slice(0, 50);
  saveChatHistory(trimmedHistory);
  
  return trimmedHistory;
};

// Delete a specific chat
export const deleteChat = (chatId) => {
  const history = getChatHistory();
  const filteredHistory = history.filter(chat => chat.id !== chatId);
  saveChatHistory(filteredHistory);
  return filteredHistory;
};

// Create new chat object
export const createNewChat = (firstMessage = '') => {
  return {
    id: generateChatId(),
    title: generateChatTitle(firstMessage),
    messages: [],
    createdAt: Date.now(),
    lastUpdated: Date.now()
  };
};

// Update chat title based on messages
export const updateChatTitle = (chatId, messages) => {
  if (messages.length === 0) return;
  
  const firstUserMessage = messages.find(msg => msg.sender === 'user');
  if (!firstUserMessage) return;
  
  const newTitle = generateChatTitle(firstUserMessage.text);
  const history = getChatHistory();
  const chatIndex = history.findIndex(chat => chat.id === chatId);
  
  if (chatIndex >= 0) {
    history[chatIndex].title = newTitle;
    saveChatHistory(history);
  }
};

// Clear all chat history
export const clearAllChats = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// Export chat data (for backup/sharing)
export const exportChatData = () => {
  const history = getChatHistory();
  const dataStr = JSON.stringify(history, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `chatbot-history-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
};