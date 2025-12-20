import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Target, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '../common';

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
    <section id="features" className="py-20 relative bg-gray-50 dark:bg-slate-900" ref={featuresRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Professional Growth</span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-slate-300 max-w-3xl mx-auto">
            Everything you need to set, track, and achieve your productivity goals with precision and insight.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group"
            >
              <Card
                hover
                className="h-full transition-all duration-300 group-hover:bg-white dark:group-hover:bg-slate-800/50 group-hover:border-purple-300 dark:group-hover:border-slate-600/50"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}