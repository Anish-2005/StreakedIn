import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-app-border/40 py-16 bg-app-bg transition-colors duration-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                StreakedIn
              </span>
            </div>
            <p className="text-app-text-muted font-medium transition-colors duration-600">
              Professional productivity tracking reimagined.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-bold text-app-text transition-colors duration-600">Product</h3>
            <ul className="space-y-2 text-app-text-muted">
              <li><a href="#features" className="hover:text-app-text transition-colors duration-300">Features</a></li>
              <li><a href="#testimonials" className="hover:text-app-text transition-colors duration-300">Testimonials</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-300">Pricing</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-300">Security</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-bold text-app-text transition-colors duration-600">Company</h3>
            <ul className="space-y-2 text-app-text-muted">
              <li><a href="#" className="hover:text-app-text transition-colors duration-300">About</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-300">Blog</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-300">Careers</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-300">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-bold text-app-text transition-colors duration-600">Legal</h3>
            <ul className="space-y-2 text-app-text-muted">
              <li><a href="#" className="hover:text-app-text transition-colors duration-300">Privacy</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-300">Terms</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-300">Cookies</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-300">License</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-app-border/20 py-8" />

        {/* Bottom Info */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-app-text-muted text-sm font-medium transition-colors duration-600">
            &copy; 2024 StreakedIn. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-app-text-muted hover:text-app-text text-sm font-medium transition-colors duration-300">Twitter</a>
            <a href="#" className="text-app-text-muted hover:text-app-text text-sm font-medium transition-colors duration-300">LinkedIn</a>
            <a href="#" className="text-app-text-muted hover:text-app-text text-sm font-medium transition-colors duration-300">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}