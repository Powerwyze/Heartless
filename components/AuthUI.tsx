import React, { useState } from 'react';
import { signIn, signUp } from '../services/authService';

interface AuthUIProps {
  onAuthSuccess: () => void;
}

export const AuthUI: React.FC<AuthUIProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md">
        {/* Retro-styled auth card */}
        <div className="bg-gradient-to-b from-gray-900 to-black border-4 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[color:var(--theme-primary)] mb-2 tracking-wider">
              HEARTLESS
            </h1>
            <p className="text-sm text-gray-400 tracking-[0.2em] uppercase">
              Partner Dex System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[color:var(--theme-primary)] mb-1 tracking-wider uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-black border-2 border-pink-500 text-white focus:outline-none focus:border-pink-300"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[color:var(--theme-primary)] mb-1 tracking-wider uppercase">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-black border-2 border-pink-500 text-white focus:outline-none focus:border-pink-300"
                disabled={isLoading}
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-[color:var(--theme-primary)] mb-1 tracking-wider uppercase">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-black border-2 border-pink-500 text-white focus:outline-none focus:border-pink-300"
                  disabled={isLoading}
                />
              </div>
            )}

            {error && (
              <div className="bg-red-900/50 border-2 border-red-500 px-4 py-2 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-pink-400 text-white font-bold tracking-wider uppercase hover:bg-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-2 border-pink-300 shadow-[0_0_30px_rgba(244,114,182,0.8)]"
            >
              {isLoading ? 'LOADING...' : isSignUp ? 'SIGN UP' : 'LOG IN'}
            </button>
          </form>

          {/* Toggle between sign up and log in */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-[color:var(--theme-primary)] text-sm hover:text-[color:var(--theme-primary-hover)] transition-colors uppercase tracking-wider"
              disabled={isLoading}
            >
              {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        {/* Retro decorative elements */}
        <div className="mt-4 text-center text-xs text-gray-600 tracking-[0.3em] uppercase">
          v1.0.0 | Powered by Firebase
        </div>
      </div>
    </div>
  );
};
