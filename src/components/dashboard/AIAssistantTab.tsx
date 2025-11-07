"use client";
import { motion } from 'framer-motion';
import { Brain, Bot, Send, Zap, Bell, TrendingUp, Calendar, Volume2, VolumeX, RotateCcw, Plus, MessageSquare, Trash2, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AISuggestionsService, ChatService } from '../../lib/services';
import { useAuth } from '../../contexts/AuthContext';
import type { ChatSession } from '../../lib/services';

interface AIAssistantTabProps {
  // No props needed for this component
}

export default function AIAssistantTab({}: AIAssistantTabProps) {
  const { user, loading: authLoading } = useAuth();
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  
  // Chat session management
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatSessionId, setCurrentChatSessionId] = useState<string | null>(null);
  const [showChatList, setShowChatList] = useState<boolean>(false);
  
  // Rename functionality
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [newChatName, setNewChatName] = useState<string>('');

  // Handle clicking outside to cancel renaming
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (renamingChatId && !(event.target as Element).closest('.rename-input')) {
        cancelRenamingChat();
      }
    };

    if (renamingChatId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [renamingChatId]);

  // Load chat sessions on component mount
  useEffect(() => {
    const loadChatSessions = async () => {
      console.log('AIAssistantTab: Loading chat sessions', { user: !!user, authLoading, userId: user?.uid });
      if (user && !authLoading) {
        try {
          const sessions = await ChatService.getChatSessions(user.uid);
          setChatSessions(sessions);
          
          // If no sessions exist, create a default one
          if (sessions.length === 0) {
            const newSessionId = await ChatService.createChatSession(user.uid, 'New Chat');
            const newSessions = await ChatService.getChatSessions(user.uid);
            setChatSessions(newSessions);
            setCurrentChatSessionId(newSessionId);
          } else {
            // Set the most recent session as current
            setCurrentChatSessionId(sessions[0].id);
          }
        } catch (error) {
          console.error('Error loading chat sessions:', error);
        }
      }
    };
    loadChatSessions();
  }, [user, authLoading]);

  // Load conversation history when current chat session changes
  useEffect(() => {
    const loadChatHistory = async () => {
      if (currentChatSessionId) {
        try {
          const history = await ChatService.loadChatHistory(currentChatSessionId);
          setConversationHistory(history);
        } catch (error) {
          console.error('Error loading chat history:', error);
          setConversationHistory([]);
        }
      }
    };
    loadChatHistory();
  }, [currentChatSessionId]);

  // Show loading state while authentication is being determined
  if (authLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Productivity Assistant</h1>
              <p className="text-slate-300">Loading...</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const formatAIResponse = (text: string) => {
    // Split by lines and process each line
    const lines = text.split('\n');
    const formattedLines = lines.map((line, index) => {
      // Handle bold text (**text**)
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

      // Handle numbered lists (1. Text)
      if (/^\d+\.\s/.test(line)) {
        return `<div class="flex items-start space-x-2 mb-2">
          <span class="text-blue-400 font-medium text-sm flex-shrink-0 mt-1">${line.match(/^\d+/)?.[0]}.</span>
          <span class="text-slate-300 leading-relaxed">${line.replace(/^\d+\.\s*/, '')}</span>
        </div>`;
      }

      // Handle regular paragraphs
      if (line.trim()) {
        return `<p class="text-slate-300 leading-relaxed mb-3">${line}</p>`;
      }

      // Empty lines become spacing
      return '<div class="h-2"></div>';
    });

    return formattedLines.join('');
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  const handleAiPrompt = async () => {
    if (!aiPrompt.trim() || !user || !currentChatSessionId) return;

    const messageToSend = aiPrompt.trim();
    setLastUserMessage(messageToSend); // Store the message for display in chat
    setAiPrompt(''); // Clear the input immediately

    // Add user message to conversation history
    const newHistory = [...conversationHistory, { role: 'user' as const, content: messageToSend }];
    setConversationHistory(newHistory);

    // Save user message to Firebase
    try {
      await ChatService.saveMessage(currentChatSessionId, user.uid, 'user', messageToSend);
    } catch (error) {
      console.error('Error saving user message:', error);
    }

    setIsAiLoading(true);
    try {
      const response = await AISuggestionsService.generateAIResponse(user.uid, messageToSend, newHistory);
      setAiResponse(response);

      // Add AI response to conversation history
      const finalHistory = [...newHistory, { role: 'assistant' as const, content: response }];
      setConversationHistory(finalHistory);

      // Save AI response to Firebase
      try {
        await ChatService.saveMessage(currentChatSessionId, user.uid, 'assistant', response);
      } catch (error) {
        console.error('Error saving AI response:', error);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.';
      setAiResponse(errorMessage);
      const finalHistory = [...newHistory, { role: 'assistant' as const, content: errorMessage }];
      setConversationHistory(finalHistory);

      // Save error message to Firebase
      try {
        await ChatService.saveMessage(currentChatSessionId, user.uid, 'assistant', errorMessage);
      } catch (saveError) {
        console.error('Error saving error message:', saveError);
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const clearChatHistory = async () => {
    if (!currentChatSessionId) return;
    try {
      await ChatService.clearChatHistory(currentChatSessionId);
      setConversationHistory([]);
      setAiResponse('');
      setLastUserMessage('');
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  const createNewChat = async () => {
    if (!user) return;
    try {
      const newSessionId = await ChatService.createChatSession(user.uid, 'New Chat');
      const updatedSessions = await ChatService.getChatSessions(user.uid);
      setChatSessions(updatedSessions);
      setCurrentChatSessionId(newSessionId);
      setConversationHistory([]);
      setAiResponse('');
      setLastUserMessage('');
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const switchToChat = (chatSessionId: string) => {
    setCurrentChatSessionId(chatSessionId);
    setShowChatList(false); // Close the chat list on mobile
  };

  const deleteChat = async (chatSessionId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent switching to the chat

    if (chatSessions.length <= 1) {
      // Don't allow deleting the last chat
      return;
    }

    console.log('deleteChat called with sessionId:', chatSessionId, 'user:', user?.uid);
    try {
      await ChatService.deleteChatSession(chatSessionId);
      const updatedSessions = await ChatService.getChatSessions(user!.uid);
      setChatSessions(updatedSessions);

      // If we deleted the current chat, switch to the first available
      if (chatSessionId === currentChatSessionId) {
        setCurrentChatSessionId(updatedSessions[0]?.id || null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const startRenamingChat = (chatSessionId: string, currentTitle: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent switching to the chat
    setRenamingChatId(chatSessionId);
    setNewChatName(currentTitle);
  };

  const cancelRenamingChat = () => {
    setRenamingChatId(null);
    setNewChatName('');
  };

  const saveRenamedChat = async (chatSessionId: string) => {
    if (!newChatName.trim()) return;

    try {
      await ChatService.updateChatSession(chatSessionId, { title: newChatName.trim() });
      const updatedSessions = await ChatService.getChatSessions(user!.uid);
      setChatSessions(updatedSessions);
      setRenamingChatId(null);
      setNewChatName('');
    } catch (error) {
      console.error('Error renaming chat:', error);
    }
  };

  const handleRenameKeyPress = (chatSessionId: string, event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      saveRenamedChat(chatSessionId);
    } else if (event.key === 'Escape') {
      cancelRenamingChat();
    }
  };

  const quickAiPrompts = [
    "Analyze my productivity patterns",
    "Suggest weekly goals",
    "Optimize my schedule",
    "Review progress and suggest improvements"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* AI Assistant Header */}
      <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Productivity Assistant</h1>
            <p className="text-slate-300">Get personalized recommendations and automate your productivity tracking</p>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Sessions Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Chat History</h3>
              <button
                onClick={createNewChat}
                className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                title="New Chat"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => !renamingChatId && switchToChat(session.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    session.id === currentChatSessionId
                      ? 'bg-blue-500/20 border border-blue-500/50'
                      : 'bg-slate-700/30 hover:bg-slate-700/50'
                  } ${renamingChatId === session.id ? 'cursor-default' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {renamingChatId === session.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={newChatName}
                            onChange={(e) => setNewChatName(e.target.value)}
                            onKeyDown={(e) => handleRenameKeyPress(session.id, e)}
                            className="rename-input flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveRenamedChat(session.id);
                            }}
                            className="p-1 text-green-400 hover:text-green-300 transition-colors"
                            title="Save"
                          >
                            ✓
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelRenamingChat();
                            }}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-white truncate">
                            {session.title}
                          </p>
                          {session.lastMessage && (
                            <p className="text-xs text-slate-400 truncate mt-1">
                              {session.lastMessage}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 mt-1">
                            {session.messageCount} messages
                          </p>
                        </>
                      )}
                    </div>
                    {renamingChatId !== session.id && (
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={(e) => startRenamingChat(session.id, session.title, e)}
                          className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                          title="Rename Chat"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        {chatSessions.length > 1 && (
                          <button
                            onClick={(e) => deleteChat(session.id, e)}
                            className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete Chat"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-6">
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between flex-shrink-0">
              <h3 className="font-semibold text-white">Chat with AI Assistant</h3>
              <button
                onClick={clearChatHistory}
                className="flex items-center space-x-2 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors text-sm"
                title="Clear chat history"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 #1e293b' }}>
              {conversationHistory.length === 0 ? (
                <div className="text-center text-slate-400 py-12">
                  <Brain className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p>Ask me anything about your productivity, goals, or schedule!</p>
                </div>
              ) : (
                conversationHistory.map((message, index) => (
                  <div key={index}>
                    {message.role === 'user' ? (
                      // User Message
                      <div className="flex justify-end">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-br-none px-4 py-2 max-w-xs lg:max-w-md">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      // AI Response
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-slate-900/20 rounded-2xl rounded-bl-none px-4 py-3 flex-1">
                          <div
                            className="text-slate-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatAIResponse(message.content) }}
                          />
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/30">
                            <div className="flex space-x-3">
                              <button className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-full transition-colors font-medium">
                                Create Tasks
                              </button>
                              <button className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-full transition-colors font-medium">
                                Set Reminders
                              </button>
                              <button className="text-xs px-3 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-full transition-colors font-medium">
                                Analyze Further
                              </button>
                            </div>
                            <button
                              onClick={() => speakText(message.content)}
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                isSpeaking
                                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                  : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                              }`}
                              title={isSpeaking ? 'Stop speaking' : 'Listen to response'}
                            >
                              {isSpeaking ? (
                                <VolumeX className="w-4 h-4" />
                              ) : (
                                <Volume2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Loading indicator */}
              {isAiLoading && (
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-900/20 rounded-2xl rounded-bl-none px-4 py-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-700/50">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask for productivity advice, goal suggestions, or schedule optimization..."
                  className="flex-1 border border-slate-700/50 rounded-lg px-4 py-2 bg-slate-800/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAiPrompt()}
                />
                <button
                  onClick={handleAiPrompt}
                  disabled={isAiLoading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-95 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isAiLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Quick Prompts and Features */}
        <div className="lg:col-span-3 space-y-6">
          {/* Quick AI Prompts */}
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4">Quick Prompts</h3>
            <div className="space-y-2">
              {quickAiPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setAiPrompt(prompt);
                    handleAiPrompt();
                  }}
                  className="w-full text-left p-3 rounded-lg border border-slate-700/50 hover:border-blue-500/60 hover:bg-slate-700/40 transition-all duration-200 text-sm text-slate-300"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* AI Features */}
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4">AI Features</h3>
            <div className="space-y-3">
              {[
                { icon: <Zap className="w-4 h-4" />, label: 'Auto Goal Setting', enabled: true },
                { icon: <Bell className="w-4 h-4" />, label: 'Smart Reminders', enabled: true },
                { icon: <TrendingUp className="w-4 h-4" />, label: 'Progress Predictions', enabled: false },
                { icon: <Calendar className="w-4 h-4" />, label: 'Schedule Optimization', enabled: true }
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-400">{feature.icon}</div>
                    <span className="text-sm text-slate-300">{feature.label}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={feature.enabled} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A66C2]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}