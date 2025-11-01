import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginForm, SignupForm } from '@/components/auth';

export const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4A574]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C49563]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4A574]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-gray-400 hover:text-white transition"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span className="hidden sm:inline">Back to home</span>
      </Link>

      {/* Auth Container */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-white hover:text-[#D4A574] transition">
            StarryMeet
          </Link>
        </div>

        {/* Form Container */}
        <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
          {isSignup ? (
            <SignupForm onSwitchToLogin={() => setIsSignup(false)} />
          ) : (
            <LoginForm onSwitchToSignup={() => setIsSignup(true)} />
          )}
        </div>
      </div>
    </div>
  );
};
