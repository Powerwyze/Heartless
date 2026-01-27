import React from 'react';
import { X, Palette } from 'lucide-react';
import { themes, Theme } from '../src/config/themes';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, currentTheme, onThemeChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black border-4 border-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.8)] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
              <Palette size={20} className="text-[color:var(--theme-primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
              Theme Color
            </h3>
            <p className="text-sm text-white/40 mb-6">
              Choose your preferred color scheme. All interface elements will update to match your selection.
            </p>
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme.id)}
                className={`relative p-4 rounded-xl border-2 transition-all group ${
                  currentTheme === theme.id
                    ? 'border-white/40 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {/* Theme Preview */}
                <div className="flex gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg shadow-lg"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div
                    className="w-8 h-8 rounded-lg shadow-lg"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>

                {/* Theme Name */}
                <div className="text-left">
                  <div className="text-sm font-bold text-white mb-1">{theme.name}</div>
                  {currentTheme === theme.id && (
                    <div className="text-xs text-[color:var(--theme-primary)] font-medium">Active</div>
                  )}
                </div>

                {/* Selection Indicator */}
                {currentTheme === theme.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-white/50 leading-relaxed">
              Your theme preference is saved locally and will persist across sessions. Theme changes
              apply instantly to all UI elements throughout the app.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-pink-400 hover:bg-pink-300 text-white font-bold rounded-xl transition-colors shadow-[0_0_30px_rgba(244,114,182,0.8)]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
