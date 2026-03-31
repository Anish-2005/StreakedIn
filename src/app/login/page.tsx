"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Logo, LoginForm, GoogleSignInButton, ToggleAuthMode } from '../../components/login';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4 text-app-text transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-[-18rem] right-[-14rem] w-[38rem] h-[38rem] rounded-full bg-app-primary/15 blur-[130px]" />
      <div className="absolute bottom-[-18rem] left-[-14rem] w-[36rem] h-[36rem] rounded-full bg-emerald-500/12 blur-[120px]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Logo />

        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isSignUp={isSignUp}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
        />

        <GoogleSignInButton onClick={handleGoogleSignIn} loading={loading} />

        <ToggleAuthMode isSignUp={isSignUp} onToggle={() => setIsSignUp(!isSignUp)} />
      </motion.div>
    </div>
  );
}
