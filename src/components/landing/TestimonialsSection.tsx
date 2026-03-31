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
    <section id="testimonials" className="py-28 bg-app-bg/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-app-text mb-5 transition-colors duration-300 tracking-tight">
            Trusted By
            <br />
            <span className="bg-gradient-to-r from-app-primary to-cyan-500 bg-clip-text text-transparent">
              Teams That Execute
            </span>
          </h2>
          <p className="text-lg text-app-text-muted max-w-3xl mx-auto transition-colors duration-300">
            Join thousands of professionals who have transformed their productivity and achieved more.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.45 }}
              className="clay-card rounded-3xl p-10 sm:p-12"
            >
              <div className="flex flex-col items-center space-y-8 text-center">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-app-primary to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/25">
                    {testimonials[activeTestimonial].name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <div className="space-y-6">
                  <p className="text-xl sm:text-2xl leading-relaxed text-app-text/95 italic font-medium transition-colors duration-300">
                    "{testimonials[activeTestimonial].content}"
                  </p>
                  <div>
                    <div className="font-semibold text-lg text-app-text transition-colors duration-300">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-app-text-muted transition-colors duration-300">
                      {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2.5 mt-10">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.98 }}
                className={`transition-all duration-200 ${
                  index === activeTestimonial
                    ? 'bg-gradient-to-r from-app-primary to-cyan-500 w-8 h-2.5 rounded-full'
                    : 'bg-app-border hover:bg-app-text-muted w-2.5 h-2.5 rounded-full'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
