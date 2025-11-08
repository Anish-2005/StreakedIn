"use client";

import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
        />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">StreakedIn</h1>
      <p className="text-slate-300">Professional Productivity Dashboard</p>
    </div>
  );
}