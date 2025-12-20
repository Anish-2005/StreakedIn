import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common';

export default function CTASection() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="dark:bg-gradient-to-br dark:from-blue-500/10 dark:to-purple-600/10 light:bg-gradient-to-br light:from-blue-100/30 light:to-purple-100/30 backdrop-blur-md dark:border dark:border-slate-700/50 light:border light:border-purple-300/50 rounded-3xl p-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold dark:text-white light:text-gray-900 mb-6">
            Ready to Transform Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Productivity</span>?
          </h2>
          <p className="text-xl dark:text-slate-300 light:text-gray-700 mb-8 max-w-2xl mx-auto">
            Join StreakedIn today and start achieving your goals with professional-grade productivity tracking.
          </p>
          <Button
            size="lg"
            animated
            className="px-12 py-4 text-lg"
          >
            Start Free Trial
          </Button>
          <p className="dark:text-slate-400 light:text-gray-600 mt-4">
            No credit card required • 14-day free trial
          </p>
        </motion.div>
      </div>
    </section>
  );
}