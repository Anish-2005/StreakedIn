"use client";
import { motion } from 'framer-motion';
import { Download, Brain, LineChart, PieChart, BarChart, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

interface AnalyticsTabProps {}

export default function AnalyticsTab({}: AnalyticsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Productivity Analytics</h1>
          <p className="text-slate-300">Detailed insights into your performance and progress</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors">
            <Brain className="w-4 h-4" />
            <span>AI Analysis</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts */}
        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Productivity Trends</h3>
          <div className="h-64 bg-slate-900/20 rounded-lg flex items-center justify-center">
            <LineChart className="w-12 h-12 text-slate-500" />
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Goal Distribution</h3>
          <div className="h-64 bg-slate-900/20 rounded-lg flex items-center justify-center">
            <PieChart className="w-12 h-12 text-slate-500" />
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Weekly Performance</h3>
          <div className="h-64 bg-slate-900/20 rounded-lg flex items-center justify-center">
            <BarChart className="w-12 h-12 text-slate-500" />
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">AI Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/20 rounded-lg border border-slate-700/40">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-white">Peak Productivity</span>
              </div>
              <p className="text-sm text-slate-300">
                Your most productive hours are between 9-11 AM. Schedule important tasks during this time.
              </p>
            </div>
            <div className="p-4 bg-slate-900/20 rounded-lg border border-slate-700/40">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="font-semibold text-white">Progress Alert</span>
              </div>
              <p className="text-sm text-slate-300">
                You're on track to complete 85% of your monthly goals. Keep up the good work!
              </p>
            </div>
            <div className="p-4 bg-slate-900/20 rounded-lg border border-slate-700/40">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-4 h-4 text-orange-400" />
                <span className="font-semibold text-white">Attention Needed</span>
              </div>
              <p className="text-sm text-slate-300">
                Networking goals are lagging behind. Consider scheduling 2-3 connection requests daily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}