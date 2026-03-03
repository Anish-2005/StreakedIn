"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Logo() {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-16 h-16 mx-auto mb-4"
      >
        <Image
          src="/streakedin.png"
          alt="StreakedIn Logo"
          width={64}
          height={64}
          className="w-full h-full object-contain"
        />
      </motion.div>
      <h1 className="text-3xl font-bold text-app-text mb-2 transition-colors duration-600">StreakedIn</h1>
      <p className="text-app-text-muted transition-colors duration-600">Professional Productivity Dashboard</p>
    </div>
  );
}