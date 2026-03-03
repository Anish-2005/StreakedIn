import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common';

export default function CTASection() {
  return (
    <section className="py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden"
        >
          {/* Background gradient effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-app-surface/40 to-blue-600/20 rounded-3xl blur-2xl" />
          
          <div className="relative bg-app-surface/80 backdrop-blur-xl border border-app-border/40 rounded-3xl p-12 sm:p-16">
            <div className="text-center space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold text-app-text transition-colors duration-600">
                Ready to
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Transform Your Productivity?
                </span>
              </h2>
              
              <p className="text-xl text-app-text-muted max-w-2xl mx-auto font-medium transition-colors duration-600">
                Join thousands of professionals achieving their goals faster. Start your free 14-day trial today and unlock your full potential.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="px-10 py-4 text-base font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-2xl hover:shadow-purple-500/40"
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
                    className="px-10 py-4 text-base font-semibold border-app-border/60 hover:bg-app-surface/60 backdrop-blur-sm"
                  >
                    Schedule Demo
                  </Button>
                </motion.div>
              </div>

              <div className="text-app-text-muted/70 text-sm font-medium transition-colors duration-600">
                <p>No credit card required • Get instant access • Cancel anytime</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}