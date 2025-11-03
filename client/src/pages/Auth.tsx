import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginForm, SignupForm } from '@/components/auth';

export const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-[#C6A34F]/30 via-[#D4A574]/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-gradient-to-tl from-[#C49563]/25 via-[#D4A574]/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-[#C6A34F]/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(198,163,79,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,163,79,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-gray-400 hover:text-[#C6A34F] transition-all duration-300 group"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-1 transition-transform">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span className="hidden sm:inline font-medium">Back to home</span>
      </Link>

      {/* Auth Container */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        {/* Logo with glow effect */}
        <div className="text-center mb-10">
          <Link
            to="/"
            className="inline-block text-4xl font-bold bg-gradient-to-r from-white via-[#C6A34F] to-white bg-clip-text text-transparent hover:from-[#C6A34F] hover:via-white hover:to-[#C6A34F] transition-all duration-500"
          >
            StarryMeet
          </Link>
          <div className="mt-2 h-0.5 w-20 mx-auto bg-gradient-to-r from-transparent via-[#C6A34F] to-transparent"></div>
        </div>

        {/* Premium Glass Card */}
        <div className="relative group">
          {/* Glow effect on hover */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C6A34F] via-[#D4A574] to-[#C49563] rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>

          {/* Main Card */}
          <div className="relative bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
            {/* Inner glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C6A34F]/50 to-transparent"></div>

            {isSignup ? (
              <SignupForm onSwitchToLogin={() => setIsSignup(false)} />
            ) : (
              <LoginForm onSwitchToSignup={() => setIsSignup(true)} />
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Secure</span>
          </div>
          <div className="w-px h-3 bg-gray-700"></div>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Encrypted</span>
          </div>
          <div className="w-px h-3 bg-gray-700"></div>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
