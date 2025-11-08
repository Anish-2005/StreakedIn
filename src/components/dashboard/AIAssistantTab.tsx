"use client";
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { AISuggestionsService, ChatService } from '../../lib/services';
import { useAuth } from '../../contexts/AuthContext';
import type { ChatSession } from '../../lib/services';
import {
  AIAssistantHeader,
  ChatArea,
  ChatSessionsSidebar,
  QuickPrompts,
  AIFeatures
} from './ai-assistant';

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
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <AIAssistantHeader />

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ChatSessionsSidebar
          chatSessions={chatSessions}
          currentChatSessionId={currentChatSessionId}
          onCreateNewChat={createNewChat}
          onSwitchToChat={switchToChat}
          onDeleteChat={deleteChat}
          onStartRenaming={startRenamingChat}
          onSaveRenamedChat={saveRenamedChat}
          onCancelRenaming={cancelRenamingChat}
          renamingChatId={renamingChatId}
          newChatName={newChatName}
          setNewChatName={setNewChatName}
          onRenameKeyPress={handleRenameKeyPress}
        />

        <ChatArea
          conversationHistory={conversationHistory}
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          onSubmit={handleAiPrompt}
          onClearChat={clearChatHistory}
          isLoading={isAiLoading}
          onSpeakText={speakText}
        />

        {/* Right Sidebar - Quick Prompts and Features */}
        <div className="lg:col-span-3 space-y-6">
          <QuickPrompts
            prompts={[
              "Analyze my productivity patterns",
              "Suggest weekly goals",
              "Optimize my schedule",
              "Review progress and suggest improvements"
            ]}
            onPromptClick={(prompt) => {
              setAiPrompt(prompt);
              handleAiPrompt();
            }}
          />

          <AIFeatures />
        </div>
      </div>
    </motion.div>
  );
}