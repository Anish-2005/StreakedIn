import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    content: "StreakedIn transformed how I manage my projects. My productivity increased by 40% in just two months!",
    avatar: "/avatars/sarah.jpg"
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer",
    company: "StartupXYZ",
    content: "The goal tracking and analytics helped me stay consistent with my learning goals. Absolutely game-changing!",
    avatar: "/avatars/marcus.jpg"
  },
  {
    name: "Elena Rodriguez",
    role: "Marketing Director",
    company: "GrowthLab",
    content: "Finally, a productivity app that actually understands how professionals work. The insights are incredibly valuable.",
    avatar: "/avatars/elena.jpg"
  }
];

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 dark:bg-slate-800/20 light:bg-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold dark:text-white light:text-gray-900 mb-4">
            Trusted by <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Professionals</span>
          </h2>
          <p className="text-xl dark:text-slate-300 light:text-gray-700 max-w-3xl mx-auto">
            Join thousands of professionals who have transformed their productivity with StreakedIn.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="dark:bg-slate-800/30 light:bg-white/50 backdrop-blur-md dark:border dark:border-slate-700/50 light:border light:border-gray-300/50 rounded-2xl p-8"
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center dark:text-white light:text-white font-semibold text-lg">
                    {testimonials[activeTestimonial].name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg dark:text-slate-200 light:text-gray-800 mb-4 italic">
                    "{testimonials[activeTestimonial].content}"
                  </p>
                  <div>
                    <div className="font-semibold dark:text-white light:text-gray-900">{testimonials[activeTestimonial].name}</div>
                    <div className="dark:text-slate-400 light:text-gray-600">
                      {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Testimonial Indicators */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial
                    ? 'bg-blue-500 w-8'
                    : 'dark:bg-slate-600 dark:hover:bg-slate-500 light:bg-gray-400 light:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}