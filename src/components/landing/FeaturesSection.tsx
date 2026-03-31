import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Target, BarChart3, TrendingUp, Calendar, Brain, Shield } from 'lucide-react';

const features = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Structured Goal Planning",
    description: "Set measurable goals with checkpoints, owners, and timelines that keep execution realistic and accountable.",
    color: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/25"
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Real-Time Analytics",
    description: "Monitor trends, completion velocity, and execution quality with dashboard-grade analytics that surface bottlenecks early.",
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/25"
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI Workflow Assistant",
    description: "Generate execution plans, break down complex objectives, and get context-aware suggestions instantly.",
    color: "from-indigo-500 to-blue-500",
    glow: "shadow-indigo-500/25"
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "Priority-Based Planning",
    description: "Coordinate priorities, deadlines, and reminders in a single planning layer designed for high-output routines.",
    color: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/25"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Performance Signals",
    description: "Track momentum, consistency, and completion confidence so you can course-correct before targets slip.",
    color: "from-sky-500 to-blue-500",
    glow: "shadow-sky-500/25"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Reliable Execution Layer",
    description: "Built for daily usage with clean interaction patterns, resilient data sync, and predictable team-wide visibility.",
    color: "from-slate-500 to-slate-700",
    glow: "shadow-slate-500/20"
  }
];

export default function FeaturesSection() {
  const featuresRef = useRef(null);

  return (
    <section id="features" className="py-28 relative bg-app-bg transition-colors duration-300" ref={featuresRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-app-text mb-5 transition-colors duration-300 tracking-tight">
            Everything Needed To Operate
            <br />
            <span className="bg-gradient-to-r from-app-primary to-cyan-500 bg-clip-text text-transparent">
              At Professional Scale
            </span>
          </h2>
          <p className="text-lg text-app-text-muted max-w-3xl mx-auto transition-colors duration-300">
            Purpose-built capabilities for planning, execution, and insight, designed to reduce friction and keep teams focused on outcomes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative h-full clay-card rounded-2xl p-7 overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-app-primary/10 to-transparent" />
                <div className="relative z-10 space-y-4">
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} ${feature.glow} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform duration-200 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-app-text transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-app-text-muted leading-relaxed transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
