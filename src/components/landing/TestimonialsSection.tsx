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
    <section id="testimonials" className="py-32 bg-app-bg/50 transition-colors duration-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-app-text mb-6 transition-colors duration-600">
            Trusted by
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Professionals Worldwide
            </span>
          </h2>
          <p className="text-xl text-app-text-muted max-w-3xl mx-auto transition-colors duration-600 font-medium">
            Join thousands of professionals who have transformed their productivity and achieved more.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className="bg-app-surface/60 backdrop-blur-lg border border-app-border/40 rounded-3xl p-12 sm:p-16"
            >
              <div className="flex flex-col items-center space-y-8 text-center">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {testimonials[activeTestimonial].name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial */}
                <div className="space-y-6">
                  <p className="text-2xl leading-relaxed text-app-text/90 italic font-medium transition-colors duration-600">
                    "{testimonials[activeTestimonial].content}"
                  </p>
                  <div>
                    <div className="font-bold text-lg text-app-text transition-colors duration-600">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-app-text-muted font-medium transition-colors duration-600">
                      {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Testimonial Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                className={`transition-all duration-600 ${
                  index === activeTestimonial
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 w-8 h-3 rounded-full'
                    : 'bg-app-border hover:bg-app-text-muted w-3 h-3 rounded-full'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}