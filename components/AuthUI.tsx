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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--theme-bg,#0a0a0a)]">
      <div className="w-full max-w-sm">
        {/* Auth card */}
        <div className="bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded-lg p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-[var(--theme-text,#F0F6F7)] mb-1 tracking-tight">
              Heartless
            </h1>
            <p className="font-mono text-[10px] text-[var(--theme-text-subtle,#747474)] uppercase tracking-wide">
              Partner Dex System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] text-[var(--theme-text-subtle,#747474)] mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--theme-surface,#141414)] border border-[var(--theme-border,#2a2a2a)] rounded text-sm text-[var(--theme-text,#F0F6F7)] focus:outline-none focus:border-[var(--theme-border-hover,#3a3a3a)] transition-colors"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] text-[var(--theme-text-subtle,#747474)] mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--theme-surface,#141414)] border border-[var(--theme-border,#2a2a2a)] rounded text-sm text-[var(--theme-text,#F0F6F7)] focus:outline-none focus:border-[var(--theme-border-hover,#3a3a3a)] transition-colors"
                disabled={isLoading}
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block font-mono text-[10px] text-[var(--theme-text-subtle,#747474)] mb-1.5 uppercase tracking-wide">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--theme-surface,#141414)] border border-[var(--theme-border,#2a2a2a)] rounded text-sm text-[var(--theme-text,#F0F6F7)] focus:outline-none focus:border-[var(--theme-border-hover,#3a3a3a)] transition-colors"
                  disabled={isLoading}
                />
              </div>
            )}

            {error && (
              <div className="bg-red-950/30 border border-red-900/50 rounded px-3 py-2 text-red-400 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[var(--theme-surface,#141414)] text-[var(--theme-text,#F0F6F7)] font-mono text-xs uppercase tracking-wide hover:bg-[var(--theme-bg-alt,#111111)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-[var(--theme-border,#2a2a2a)] hover:border-[var(--theme-border-hover,#3a3a3a)] rounded"
            >
              {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          {/* Toggle between sign up and log in */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-[var(--theme-text-muted,#919FA5)] text-xs hover:text-[var(--theme-text,#F0F6F7)] transition-colors"
              disabled={isLoading}
            >
              {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        {/* Version info */}
        <div className="mt-4 text-center font-mono text-[10px] text-[var(--theme-text-subtle,#747474)] tracking-wide">
          v1.0.0
        </div>
      </div>
    </div>
  );
};
