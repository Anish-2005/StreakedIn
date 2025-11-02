"use client";
import { motion } from 'framer-motion';
import { Brain, Bot, Send, Zap, Bell, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';

interface AIAssistantTabProps {}

export default function AIAssistantTab({}: AIAssistantTabProps) {
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const handleAiPrompt = async () => {
    if (!aiPrompt.trim()) return;

    setIsAiLoading(true);
    // Simulate AI response
    setTimeout(() => {
      setAiResponse(`Based on your current goals and progress, I recommend:

1. **Focus on React Certification**: You're 75% complete - schedule 2 hours daily to finish by next week.
2. **Networking Strategy**: Connect with 5 professionals in your field daily to reach your goal.
3. **Skill Development**: Consider adding a backend technology to your learning path for full-stack development.

Would you like me to create specific tasks for these recommendations?`);
      setIsAiLoading(false);
    }, 2000);
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
                    {aiPrompt}
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-900/20 rounded-2xl rounded-bl-none px-4 py-3 flex-1">
                    <div className="whitespace-pre-line text-slate-300">
                      {aiResponse}
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <button className="text-xs text-[#0A66C2] hover:text-[#004182]">
                        Create Tasks
                      </button>
                      <button className="text-xs text-[#0A66C2] hover:text-[#004182]">
                        Set Reminders
                      </button>
                      <button className="text-xs text-[#0A66C2] hover:text-[#004182]">
                        Analyze Further
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