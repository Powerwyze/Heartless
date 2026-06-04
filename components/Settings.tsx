import React from 'react';
import { X, Palette } from 'lucide-react';
import { themes } from '../src/config/themes';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  currentMode: 'light' | 'dark';
  onModeChange: (mode: 'light' | 'dark') => void;
  currentBg: string | null;
  onBgChange: (color: string | null) => void;
  onDeleteAccount: () => void;
}

// Background presets. Each is a single base color; bg-alt/text are auto-derived.
const BG_PRESETS: { name: string; color: string }[] = [
  { name: 'Midnight', color: '#0a0a0a' },
  { name: 'Deep Navy', color: '#0f172a' },
  { name: 'Forest', color: '#022c22' },
  { name: 'Plum', color: '#1a0a1a' },
  { name: 'Charcoal', color: '#1a1a1a' },
  { name: 'Sepia', color: '#1a0f0a' },
  { name: 'Cream', color: '#fef6e4' },
  { name: 'Rose', color: '#fff1f2' },
];

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, currentTheme, onThemeChange, currentMode, onModeChange, currentBg, onBgChange, onDeleteAccount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 overflow-y-auto">
      <div className="w-full max-w-md bg-[var(--theme-bg-alt,#111111)] border-2 border-[var(--theme-border,#2a2a2a)] rounded-lg overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-[var(--theme-border,#2a2a2a)]">
          <div className="flex items-center gap-3">
            <Palette size={18} className="text-[var(--theme-text-muted,#919FA5)]" />
            <h2 className="text-sm font-semibold text-[var(--theme-text,#F0F6F7)]">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--theme-text-subtle,#747474)] hover:text-[var(--theme-text,#F0F6F7)] transition-colors p-1.5 rounded hover:bg-[var(--theme-surface,#141414)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <div className="mb-4">
            <h3 className="font-mono text-[10px] text-[var(--theme-text-subtle,#747474)] uppercase tracking-wide mb-2">
              Theme
            </h3>
            <p className="text-xs text-[var(--theme-text-muted,#919FA5)]">
              Choose your preferred color scheme.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-mono text-[10px] text-[var(--theme-text-subtle,#747474)] uppercase tracking-wide mb-2">
              Mode
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => onModeChange('light')}
                className={`px-3 py-1.5 rounded border-2 text-xs font-mono uppercase tracking-wide transition-colors ${
                  currentMode === 'light'
                    ? 'border-[var(--theme-border-hover,#3a3a3a)] bg-[var(--theme-surface,#141414)] text-[var(--theme-text,#F0F6F7)]'
                    : 'border-[var(--theme-border,#2a2a2a)] text-[var(--theme-text-muted,#919FA5)] hover:text-[var(--theme-text,#F0F6F7)] hover:border-[var(--theme-border-hover,#3a3a3a)]'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => onModeChange('dark')}
                className={`px-3 py-1.5 rounded border-2 text-xs font-mono uppercase tracking-wide transition-colors ${
                  currentMode === 'dark'
                    ? 'border-[var(--theme-border-hover,#3a3a3a)] bg-[var(--theme-surface,#141414)] text-[var(--theme-text,#F0F6F7)]'
                    : 'border-[var(--theme-border,#2a2a2a)] text-[var(--theme-text-muted,#919FA5)] hover:text-[var(--theme-text,#F0F6F7)] hover:border-[var(--theme-border-hover,#3a3a3a)]'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Background */}
          <div className="mb-4">
            <h3 className="font-mono text-[10px] text-[var(--theme-text-subtle,#747474)] uppercase tracking-wide mb-2">
              Background
            </h3>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {BG_PRESETS.map((preset) => (
                <button
                  key={preset.color}
                  onClick={() => onBgChange(preset.color)}
                  title={preset.name}
                  aria-label={`Set background ${preset.name}`}
                  className={`relative h-10 rounded border-2 transition-all ${
                    currentBg === preset.color
                      ? 'border-[var(--theme-primary,#F0F6F7)]'
                      : 'border-[var(--theme-border,#2a2a2a)] hover:border-[var(--theme-border-hover,#3a3a3a)]'
                  }`}
                  style={{ backgroundColor: preset.color }}
                >
                  {currentBg === preset.color && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--theme-primary,#F0F6F7)]" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 flex-1 px-3 py-2 rounded border-2 border-[var(--theme-border,#2a2a2a)] cursor-pointer hover:border-[var(--theme-border-hover,#3a3a3a)] transition-colors">
                <input
                  type="color"
                  value={currentBg || '#0a0a0a'}
                  onChange={(e) => onBgChange(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--theme-text-muted,#919FA5)]">Custom</span>
              </label>
              {currentBg && (
                <button
                  onClick={() => onBgChange(null)}
                  className="px-3 py-2 rounded border-2 border-[var(--theme-border,#2a2a2a)] font-mono text-[10px] uppercase tracking-wide text-[var(--theme-text-muted,#919FA5)] hover:text-[var(--theme-text,#F0F6F7)] hover:border-[var(--theme-border-hover,#3a3a3a)] transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme.id)}
                className={`relative p-3 rounded border-2 transition-colors ${
                  currentTheme === theme.id
                    ? 'border-[var(--theme-border-hover,#3a3a3a)] bg-[var(--theme-surface,#141414)]'
                    : 'border-[var(--theme-border,#2a2a2a)] hover:border-[var(--theme-border-hover,#3a3a3a)] hover:bg-[var(--theme-surface,#141414)]'
                }`}
              >
                {/* Theme Preview */}
                <div className="flex gap-1.5 mb-2">
                  <div
                    className="w-5 h-5 rounded"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div
                    className="w-5 h-5 rounded"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>

                {/* Theme Name */}
                <div className="text-left">
                  <div className="text-xs font-medium text-[var(--theme-text,#F0F6F7)]">{theme.name}</div>
                  {currentTheme === theme.id && (
                    <div className="font-mono text-[9px] text-[var(--theme-text-muted,#919FA5)]">Active</div>
                  )}
                </div>

                {/* Selection Indicator */}
                {currentTheme === theme.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-1.5 h-1.5 bg-[var(--theme-primary,#F0F6F7)] rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-4 p-3 bg-[var(--theme-surface,#141414)] rounded border-2 border-[var(--theme-border,#2a2a2a)]">
            <p className="text-[11px] text-[var(--theme-text-subtle,#747474)] leading-relaxed">
              Your theme preference is saved locally and will persist across sessions.
            </p>
          </div>

          {/* Account */}
          <div className="mt-4">
            <h3 className="font-mono text-[10px] text-[var(--theme-text-subtle,#747474)] uppercase tracking-wide mb-2">
              Account
            </h3>
            <div className="p-3 bg-[var(--theme-bg-alt,#111111)] rounded border-2 border-red-900/50">
              <p className="text-[11px] text-[var(--theme-text-muted,#919FA5)] leading-relaxed">
                This will permanently remove your account and all partner data.
              </p>
              <button
                onClick={onDeleteAccount}
                className="mt-3 w-full px-4 py-2 rounded border border-red-900/50 text-red-400 text-[10px] font-mono uppercase tracking-wide transition-colors hover:border-red-700 hover:text-red-300 hover:bg-red-950/30"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-[var(--theme-border,#2a2a2a)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--theme-surface,#141414)] hover:bg-[var(--theme-bg-alt,#111111)] text-[var(--theme-text,#F0F6F7)] font-mono text-xs uppercase tracking-wide rounded border-2 border-[var(--theme-border,#2a2a2a)] hover:border-[var(--theme-border-hover,#3a3a3a)] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
