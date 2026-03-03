import React from 'react';
import { motion } from 'framer-motion';
import { Award, ArrowRight, Play, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '../common';

// Dynamically import Three.js to avoid SSR issues
const Scene = dynamic(() => import('../Scene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
});

const stats = [
  { number: "98%", label: "Success Rate" },
  { number: "50K+", label: "Goals Achieved" },
  { number: "4.9/5", label: "User Rating" }
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-app-bg" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl" />
        </div>
        <Scene />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-app-surface/40 backdrop-blur-lg border border-app-border/60 hover:bg-app-surface/60 transition-all duration-600"
          >
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-app-text-muted transition-colors duration-600">
              Trusted by 10,000+ professionals worldwide
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-app-text transition-colors duration-600 leading-tight">
              Master Your
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Productivity
              </span>
            </h1>
            <p className="text-lg md:text-xl text-app-text-muted max-w-2xl mx-auto leading-relaxed font-medium transition-colors duration-600">
              Transform goals into achievements with intelligent tracking, real-time analytics, and AI-powered insights. The ultimate productivity system for professionals.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                size="lg"
                className="px-8 py-4 text-base font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-xl hover:shadow-purple-500/30"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Start Free Trial
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-base font-semibold border-app-border/60 hover:bg-app-surface/40 backdrop-blur-sm"
                icon={<Play className="w-5 h-5" />}
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="grid grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-app-text-muted text-sm font-medium mt-2 transition-colors duration-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="flex flex-col items-center space-y-2"
        >
          <span className="text-xs font-semibold text-app-text-muted/80 uppercase tracking-wider">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-app-text-muted/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}