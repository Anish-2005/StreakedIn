import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Play, ChevronDown } from 'lucide-react';
import { Button } from '../common';

const stats = [
  { number: "98%", label: "Weekly completion consistency" },
  { number: "50K+", label: "Goals delivered by users" },
  { number: "4.9/5", label: "Average user satisfaction" }
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-app-bg" />
        <div className="absolute top-10 left-[10%] w-96 h-96 bg-app-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-[8%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="grid lg:grid-cols-2 gap-10 items-center"
        >
          <div className="space-y-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12, duration: 0.45 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-app-surface border border-app-border"
            >
              <ShieldCheck className="w-4 h-4 text-app-primary" />
              <span className="text-sm font-medium text-app-text-muted">
                Trusted by 10,000+ professionals worldwide
              </span>
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-app-text leading-[1.02]">
                Run your goals like a high-performing team.
              </h1>
              <p className="text-lg md:text-xl text-app-text-muted max-w-2xl leading-relaxed">
                Centralize planning, execution, and analytics in one dashboard with built-in AI coaching and real-time momentum tracking.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-3">
              <Link href="/login">
                <Button
                  variant="primary"
                  size="lg"
                  className="min-w-48"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Start Free Trial
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="min-w-44"
                icon={<Play className="w-5 h-5" />}
              >
                Watch Demo
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.6 }}
            className="clay-card rounded-3xl p-6 sm:p-7 surface-gradient"
          >
            <div className="border border-app-border rounded-2xl bg-app-bg-subtle/60 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-app-text-muted">
                  Weekly Performance
                </h3>
                <span className="text-xs text-app-text-muted">Updated 2m ago</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {stats.map((stat, index) => (
                  <div key={index} className="rounded-xl border border-app-border bg-app-surface/70 p-4">
                    <div className="text-2xl font-semibold text-app-text">{stat.number}</div>
                    <div className="text-xs mt-1 text-app-text-muted leading-relaxed">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  ['Goals On Track', 87],
                  ['Tasks Completed', 72],
                  ['Focus Sessions', 64],
                ].map(([label, value]) => (
                  <div key={label as string} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-app-text-muted">{label}</span>
                      <span className="font-medium text-app-text">{value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-app-bg-subtle overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-app-primary to-cyan-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.3, repeat: Infinity }}
          className="flex flex-col items-center space-y-2"
        >
          <span className="text-xs font-semibold text-app-text-muted/80 uppercase tracking-wider">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-app-text-muted/80" />
        </motion.div>
      </motion.div>
    </section>
  );
}
