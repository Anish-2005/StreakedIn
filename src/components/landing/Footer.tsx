import React from 'react';
import { AppLogo } from '../common';

export default function Footer() {
  return (
    <footer className="border-t border-app-border py-14 bg-app-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <AppLogo size="sm" withGradientBg />
              <span className="text-xl font-semibold text-app-text">StreakedIn</span>
            </div>
            <p className="text-app-text-muted transition-colors duration-300">
              Professional productivity tracking reimagined.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-app-text transition-colors duration-300">Product</h3>
            <ul className="space-y-2 text-app-text-muted">
              <li><a href="#features" className="hover:text-app-text transition-colors duration-200">Features</a></li>
              <li><a href="#testimonials" className="hover:text-app-text transition-colors duration-200">Testimonials</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-200">Pricing</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-200">Security</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-app-text transition-colors duration-300">Company</h3>
            <ul className="space-y-2 text-app-text-muted">
              <li><a href="#" className="hover:text-app-text transition-colors duration-200">About</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-200">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-app-text transition-colors duration-300">Legal</h3>
            <ul className="space-y-2 text-app-text-muted">
              <li><a href="#" className="hover:text-app-text transition-colors duration-200">Privacy</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-200">Terms</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-200">Cookies</a></li>
              <li><a href="#" className="hover:text-app-text transition-colors duration-200">License</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-app-border/60 py-7" />

        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-app-text-muted text-sm transition-colors duration-300">
            &copy; 2024 StreakedIn. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-app-text-muted hover:text-app-text text-sm transition-colors duration-200">Twitter</a>
            <a href="#" className="text-app-text-muted hover:text-app-text text-sm transition-colors duration-200">LinkedIn</a>
            <a href="#" className="text-app-text-muted hover:text-app-text text-sm transition-colors duration-200">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
