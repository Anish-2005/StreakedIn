"use client";
import { motion } from 'framer-motion';
import { Brain, Bot, Send, Zap, Bell, TrendingUp, Calendar, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AISuggestionsService } from '../../lib/services';
import { useAuth } from '../../contexts/AuthContext';

interface AIAssistantTabProps {}

export default function AIAssistantTab({}: AIAssistantTabProps) {
  const { user } = useAuth();
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');

  useEffect(() => {
    return () => {
      // Cleanup: stop any ongoing speech when component unmounts
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
    if (!aiPrompt.trim() || !user) return;

    const messageToSend = aiPrompt.trim();
    setLastUserMessage(messageToSend); // Store the message for display in chat
    setAiPrompt(''); // Clear the input immediately

    setIsAiLoading(true);
    try {
      const response = await AISuggestionsService.generateAIResponse(user.uid, messageToSend);
      setAiResponse(response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setAiResponse('I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.');
    } finally {
      setIsAiLoading(false);
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
      className="max-w-4xl mx-auto space-y-6"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Chat */}
        <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-sm">
          <div className="p-4 border-b border-slate-700/50">
            <h3 className="font-semibold text-white">Chat with AI Assistant</h3>
          </div>

          {/* Chat Messages */}
          <div className="p-4 h-96 overflow-y-auto space-y-4">
            {aiResponse ? (
              <>
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-br-none px-4 py-2 max-w-xs">
                    {lastUserMessage}
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-900/20 rounded-2xl rounded-bl-none px-4 py-3 flex-1">
                    <div
                      className="text-slate-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatAIResponse(aiResponse) }}
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
                        onClick={() => speakText(aiResponse)}
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
              </>
            ) : (
              <div className="text-center text-slate-400 py-12">
                <Brain className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p>Ask me anything about your productivity, goals, or schedule!</p>
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

        {/* Quick Prompts */}
        <div className="space-y-6">
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