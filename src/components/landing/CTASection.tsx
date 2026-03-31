import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../common';

export default function CTASection() {
  return (
    <section id="get-started" className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-app-primary/20 via-app-surface/40 to-emerald-500/20 rounded-3xl blur-2xl" />

          <div className="relative clay-card rounded-3xl p-10 sm:p-14">
            <div className="text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-semibold text-app-text transition-colors duration-300 tracking-tight">
                Ready to
                <br />
                <span className="bg-gradient-to-r from-app-primary to-cyan-500 bg-clip-text text-transparent">
                  Upgrade Your Execution System?
                </span>
              </h2>

              <p className="text-lg text-app-text-muted max-w-2xl mx-auto transition-colors duration-300">
                Join thousands of professionals achieving their goals faster. Start your free 14-day trial today and unlock your full potential.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link href="/login">
                  <Button size="lg" className="px-10">
                    Start Free Trial
                  </Button>
                </Link>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-10"
                  >
                    Schedule Demo
                  </Button>
                </motion.div>
              </div>

              <div className="text-app-text-muted/80 text-sm transition-colors duration-300">
                <p>No credit card required | Get instant access | Cancel anytime</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
