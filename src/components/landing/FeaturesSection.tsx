import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Target, BarChart3, TrendingUp, Calendar } from 'lucide-react';

const features = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Goal Setting",
    description: "Set SMART goals and break them down into achievable daily tasks with our intuitive goal management system.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Progress Analytics",
    description: "Track your productivity trends with detailed analytics and visual progress reports.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Performance Metrics",
    description: "Measure your productivity through multiple metrics and get personalized insights.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "Daily Planning",
    description: "Plan your day with our intelligent task scheduler that adapts to your productivity patterns.",
    color: "from-orange-500 to-red-500"
  }
];

export default function FeaturesSection() {
  const featuresRef = useRef(null);

  return (
    <section id="features" className="py-32 relative bg-app-bg transition-colors duration-600" ref={featuresRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-app-text mb-6 transition-colors duration-600">
            Powerful Features
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              For Professional Growth
            </span>
          </h2>
          <p className="text-xl text-app-text-muted max-w-3xl mx-auto transition-colors duration-600 font-medium">
            Everything you need to set, track, and achieve your productivity goals with precision and insight. Designed for professionals who demand results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative h-full bg-app-surface/40 hover:bg-app-surface/70 border border-app-border/40 hover:border-purple-400/40 rounded-2xl p-8 transition-all duration-600 backdrop-blur-sm overflow-hidden">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-600" />
                
                {/* Content */}
                <div className="relative z-10 space-y-4">
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-${feature.color.split('-')[2]}/30`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-app-text transition-colors duration-600">
                    {feature.title}
                  </h3>
                  <p className="text-app-text-muted leading-relaxed transition-colors duration-600 font-medium">
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