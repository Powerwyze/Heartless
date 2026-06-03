import React from 'react';
import { Sparkles, Plus, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, onStart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
      <div className="w-full max-w-sm bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded-lg p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-[var(--theme-primary,#F0F6F7)]">
            <Sparkles size={20} strokeWidth={2} />
          </span>
          <h2 className="text-base font-semibold text-[var(--theme-text,#F0F6F7)]">
            Welcome to Heartless
          </h2>
        </div>

        {/* Body */}
        <div className="space-y-3">
          <p className="text-xs text-[var(--theme-text-muted,#919FA5)] leading-relaxed">
            Track the people who matter — AI-powered relationship dex.
          </p>

          <p className="text-xs text-[var(--theme-text-muted,#919FA5)] leading-relaxed">
            Tap the{' '}
            <span className="inline-flex items-center gap-1 font-medium text-[var(--theme-text,#F0F6F7)]">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded border border-[var(--theme-border,#2a2a2a)] bg-[var(--theme-surface,#141414)]">
                <Plus size={10} strokeWidth={2.5} />
              </span>
              NEW
            </span>{' '}
            button in the side/bottom nav to add your first partner. Upload their
            photo, answer a few quick questions, and Cupid will build their profile
            + 16-bit avatar.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={onStart}
            className="w-full px-3 py-2 bg-[var(--theme-surface,#141414)] text-[var(--theme-text,#F0F6F7)] rounded border border-[var(--theme-border,#2a2a2a)] hover:border-[var(--theme-border-hover,#3a3a3a)] transition-colors text-xs font-medium flex items-center justify-center gap-1.5"
          >
            Got it — let's go <ArrowRight size={14} />
          </button>
          <button
            onClick={onClose}
            className="w-full px-3 py-1.5 bg-transparent text-[var(--theme-text-muted,#919FA5)] hover:text-[var(--theme-text,#F0F6F7)] rounded transition-colors text-xs"
          >
            I'll explore first
          </button>
        </div>
      </div>
    </div>
  );
};
