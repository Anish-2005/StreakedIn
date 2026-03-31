"use client";

import { motion } from 'framer-motion';
import { AppLogo } from '../common';

export default function Logo() {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-4"
      >
        <AppLogo size="lg" withGradientBg />
      </motion.div>
      <h1 className="text-3xl font-semibold text-app-text mb-2 transition-colors duration-300 tracking-tight">StreakedIn</h1>
      <p className="text-app-text-muted transition-colors duration-300">Professional Productivity Dashboard</p>
    </div>
  );
}
