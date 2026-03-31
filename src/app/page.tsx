// pages/index.js
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/landing/Navigation';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import LoadingSpinner from '../components/landing/LoadingSpinner';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return <LoadingSpinner />;
  }

  // Don't render anything if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-app-bg text-app-text transition-colors duration-300 relative overflow-hidden">
      <div className="fixed top-[-28rem] right-[-16rem] w-[52rem] h-[52rem] rounded-full bg-app-primary/12 blur-[150px] z-0" />
      <div className="fixed bottom-[-24rem] left-[-14rem] w-[48rem] h-[48rem] rounded-full bg-emerald-500/10 blur-[140px] z-0" />

      <div className="relative z-10">
        <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
