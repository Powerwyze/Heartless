import React from 'react';

export const PixelButton: React.FC<{
  onClick?: () => void,
  children: React.ReactNode,
  variant?: 'primary' | 'secondary' | 'danger',
  className?: string,
  disabled?: boolean
}> = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const styles = {
    primary: 'bg-[var(--theme-surface,#141414)] hover:bg-[var(--theme-bg-alt,#111111)] text-[var(--theme-text,#F0F6F7)] border border-[var(--theme-border,#2a2a2a)] hover:border-[var(--theme-border-hover,#3a3a3a)]',
    secondary: 'bg-transparent hover:bg-[var(--theme-surface,#141414)] text-[var(--theme-text-muted,#919FA5)] hover:text-[var(--theme-text,#F0F6F7)] border border-[var(--theme-border,#2a2a2a)]',
    danger: 'bg-transparent hover:bg-red-950/30 text-red-400 hover:text-red-300 border border-red-900/50 hover:border-red-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2 rounded font-medium transition-colors duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const CompassionMeter: React.FC<{ current: number, max: number, big?: boolean }> = ({ current, max, big }) => {
  const hearts = [];
  for (let i = 1; i <= max; i++) {
    const size = big ? "w-5 h-5" : "w-3.5 h-3.5";
    const isActive = current >= i;
    const isHalf = !isActive && current >= i - 0.5;

    hearts.push(
      <svg
        key={i}
        viewBox="0 0 24 24"
        className={`${size} ${isActive ? 'text-[var(--theme-primary,#F0F6F7)] fill-[var(--theme-primary,#F0F6F7)]' : isHalf ? 'text-[var(--theme-primary,#F0F6F7)] fill-[var(--theme-primary,#F0F6F7)] opacity-40' : 'text-[var(--theme-text-subtle,#747474)] fill-none'} transition-colors duration-200`}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  return <div className="flex flex-wrap gap-1">{hearts}</div>;
};

export const StatBar: React.FC<{ label: string, value: number, color?: string }> = ({ label, value, color = 'bg-[var(--theme-primary,#F0F6F7)]' }) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-1.5 px-1">
      <span className="font-mono text-[10px] font-medium uppercase tracking-label text-[var(--theme-text-subtle,#747474)]">{label}</span>
      <span className="font-mono text-[10px] font-medium text-[var(--theme-text-muted,#919FA5)]">{value}%</span>
    </div>
    <div className="h-1.5 bg-[var(--theme-border,#2a2a2a)] rounded-sm overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-700`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

export const TagPill: React.FC<{ children: string, variant?: 'cyan' | 'pink' }> = ({ children, variant = 'cyan' }) => (
  <span className={`px-2.5 py-1 font-mono text-[9px] font-medium rounded border uppercase tracking-wide ${
    variant === 'cyan'
      ? 'border-[var(--theme-border,#2a2a2a)] text-[var(--theme-accent,#919FA5)] bg-[var(--theme-surface,#141414)]'
      : 'border-[var(--theme-border,#2a2a2a)] text-[var(--theme-primary,#F0F6F7)] bg-[var(--theme-surface,#141414)]'
  }`}>
    {children}
  </span>
);

export const RadarChart: React.FC<{ stats: { label: string, value: number }[] }> = ({ stats }) => {
  const size = 160;
  const center = size / 2;
  const radius = size * 0.4;

  const points = stats.map((s, i) => {
    const angle = (Math.PI * 2 * i) / stats.length - Math.PI / 2;
    const r = (s.value / 100) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  }).join(' ');

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid Circles */}
        {[0.25, 0.5, 0.75, 1].map(scale => (
          <circle key={scale} cx={center} cy={center} r={radius * scale} fill="none" stroke="var(--theme-border, #2a2a2a)" strokeWidth="1" />
        ))}
        {/* Grid Lines */}
        {stats.map((_, i) => {
          const angle = (Math.PI * 2 * i) / stats.length - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="var(--theme-border, #2a2a2a)" strokeWidth="1" />
          );
        })}
        {/* Polygon */}
        <polygon points={points} fill="var(--theme-primary, #F0F6F7)" fillOpacity="0.1" stroke="var(--theme-primary, #F0F6F7)" strokeWidth="1.5" />
        {/* Labels */}
        {stats.map((s, i) => {
          const angle = (Math.PI * 2 * i) / stats.length - Math.PI / 2;
          const x = center + (radius + 20) * Math.cos(angle);
          const y = center + (radius + 20) * Math.sin(angle);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" fill="var(--theme-text-subtle, #747474)" fontSize="9" fontWeight="500" fontFamily="JetBrains Mono, monospace" className="uppercase">
              {s.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export const Modal: React.FC<{ isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/90" onClick={onClose}></div>
      <div className="relative bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded-lg w-full max-w-lg overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[var(--theme-border,#2a2a2a)] flex justify-between items-center">
          <h2 className="text-base font-semibold text-[var(--theme-text,#F0F6F7)] tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--theme-surface,#141414)] rounded transition-colors text-[var(--theme-text-subtle,#747474)] hover:text-[var(--theme-text,#F0F6F7)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Scanlines: React.FC = () => null;
