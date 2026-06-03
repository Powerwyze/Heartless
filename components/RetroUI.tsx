import React from 'react';

// HrtlessLogo: spells "HRTLESS" with each letter inside its own heart.
// `size` controls heart height in px; letters scale with it.
export const HrtlessLogo: React.FC<{
  size?: number;
  className?: string;
  letterClassName?: string;
  heartClassName?: string;
}> = ({ size = 28, className = '', letterClassName = '', heartClassName = '' }) => {
  const letters = ['H', 'R', 'T', 'L', 'E', 'S', 'S'];
  return (
    <div className={`inline-flex items-center gap-1 ${className}`} aria-label="HRTLESS">
      {letters.map((ch, i) => (
        <span
          key={i}
          className="relative inline-flex items-center justify-center"
          style={{ width: size, height: size, animation: `hrtlessPulse 1.6s ease-in-out ${i * 120}ms infinite` }}
        >
          <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            className={`absolute inset-0 drop-shadow-[0_0_4px_rgba(248,113,113,0.7)] ${heartClassName}`}
            aria-hidden="true"
          >
            <path
              d="M12 21s-7.5-4.5-9.5-9.2C1 8.5 3 5 6.5 5c2 0 3.5 1.1 4.4 2.5h.2C12 6.1 13.5 5 15.5 5 19 5 21 8.5 19.5 11.8 17.5 16.5 12 21 12 21z"
              fill="#ef4444"
              stroke="#fca5a5"
              strokeWidth="0.6"
            />
          </svg>
          <span
            className={`relative font-bold text-white select-none ${letterClassName}`}
            style={{ fontSize: size * 0.42, lineHeight: 1, marginTop: size * 0.05, textShadow: '0 1px 2px rgba(0,0,0,0.6)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}
          >
            {ch}
          </span>
        </span>
      ))}
      <style>{`@keyframes hrtlessPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }`}</style>
    </div>
  );
};


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
      style={{ touchAction: 'manipulation' }}
      className={`px-5 py-3 md:py-2 min-h-[44px] md:min-h-0 rounded font-medium text-sm transition-colors duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const CompassionMeter: React.FC<{ current: number, max: number, big?: boolean }> = ({ current, max, big }) => {
  const hearts = [];
  for (let i = 1; i <= max; i++) {
    const size = big ? "w-7 h-7 md:w-5 md:h-5" : "w-4 h-4 md:w-3.5 md:h-3.5";
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
  return <div className="flex flex-wrap justify-center gap-1.5 md:gap-1">{hearts}</div>;
};

// Pokedex accent tones — maps a tone name to Tailwind utility classes.
// Theme vars stay the source of truth for chrome; tones only tint per-tab accents.
export type PokedexTone = 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'pink';

export const toneClasses: Record<PokedexTone, { text: string; bg: string; dot: string; border: string; glow: string; fill: string }> = {
  green:  { text: 'text-emerald-400', bg: 'bg-emerald-400',  dot: 'bg-emerald-400',  border: 'border-emerald-500/30', glow: 'bg-emerald-500/[0.04]', fill: 'from-emerald-500 to-emerald-300' },
  amber:  { text: 'text-amber-400',   bg: 'bg-amber-400',    dot: 'bg-amber-400',    border: 'border-amber-500/30',   glow: 'bg-amber-500/[0.04]',   fill: 'from-amber-500 to-amber-300' },
  red:    { text: 'text-red-400',     bg: 'bg-red-400',      dot: 'bg-red-400',      border: 'border-red-500/30',     glow: 'bg-red-500/[0.04]',     fill: 'from-red-500 to-red-300' },
  blue:   { text: 'text-blue-400',    bg: 'bg-blue-400',     dot: 'bg-blue-400',     border: 'border-blue-500/30',    glow: 'bg-blue-500/[0.04]',    fill: 'from-blue-500 to-blue-300' },
  purple: { text: 'text-purple-400',  bg: 'bg-purple-400',   dot: 'bg-purple-400',   border: 'border-purple-500/30',  glow: 'bg-purple-500/[0.06]',  fill: 'from-purple-500 to-purple-300' },
  pink:   { text: 'text-pink-400',    bg: 'bg-pink-400',     dot: 'bg-pink-400',     border: 'border-pink-500/30',    glow: 'bg-pink-500/[0.05]',    fill: 'from-pink-500 to-pink-300' },
};

// Small animated status LED, Pokedex-device style.
export const PokedexLED: React.FC<{ tone?: PokedexTone, size?: number }> = ({ tone = 'green', size = 9 }) => (
  <span
    className={`inline-block rounded-full ${toneClasses[tone].dot} animate-pulse shadow-[0_0_6px_currentColor]`}
    style={{ width: size, height: size }}
  />
);

// CRT/LCD "screen-within-a-screen" wrapper: chunky bezel + inner inset + tinted glow.
export const PokedexScreen: React.FC<{ tone?: PokedexTone, children: React.ReactNode, className?: string }> = ({ tone = 'green', children, className = '' }) => (
  <div className={`relative rounded-lg border-4 ${toneClasses[tone].border} bg-[var(--theme-bg-alt,#111111)] shadow-inner overflow-hidden ${className}`}>
    <div className={`pointer-events-none absolute inset-0 ${toneClasses[tone].glow}`} />
    <div className="relative rounded border border-[var(--theme-border,#2a2a2a)] m-1.5 p-3 md:p-4 bg-[var(--theme-surface,#141414)]/60">
      {children}
    </div>
  </div>
);

// Sticky HUD header for each tab: colored band + mono caps title + LED + counter.
export const TabHeader: React.FC<{ tone?: PokedexTone, title: string, counter?: string, icon?: React.ReactNode }> = ({ tone = 'green', title, counter, icon }) => (
  <div className={`sticky top-0 z-10 -mx-1 mb-1 flex items-center gap-3 rounded border-l-4 ${toneClasses[tone].border.replace('/30', '')} bg-[var(--theme-bg-alt,#111111)] px-3 py-2 backdrop-blur`}>
    <PokedexLED tone={tone} />
    {icon && <span className={toneClasses[tone].text}>{icon}</span>}
    <h3 className={`font-mono text-xs md:text-sm font-semibold uppercase tracking-[0.15em] ${toneClasses[tone].text}`}>{title}</h3>
    {counter && (
      <span className="ml-auto font-mono text-[10px] uppercase tracking-wide text-[var(--theme-text-subtle,#747474)]">{counter}</span>
    )}
  </div>
);

export const StatBar: React.FC<{ label: string, value: number, color?: string, tone?: PokedexTone, segmented?: boolean }> = ({ label, value, color, tone, segmented }) => {
  const fillClass = tone
    ? `bg-gradient-to-r ${toneClasses[tone].fill}`
    : (color || 'bg-[var(--theme-primary,#F0F6F7)]');
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5 px-1">
        <span className="font-mono text-[10px] font-medium uppercase tracking-label text-[var(--theme-text-subtle,#747474)]">{label}</span>
        <span className={`font-mono text-[11px] font-semibold ${tone ? toneClasses[tone].text : 'text-[var(--theme-text-muted,#919FA5)]'}`}>{value}%</span>
      </div>
      <div className="relative h-2 bg-[var(--theme-border,#2a2a2a)] rounded-sm overflow-hidden">
        <div
          className={`h-full ${fillClass} transition-all duration-700`}
          style={{ width: `${value}%` }}
        ></div>
        {segmented && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 9px, var(--theme-bg-alt,#111111) 9px, var(--theme-bg-alt,#111111) 10px)' }}
          />
        )}
      </div>
    </div>
  );
};

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
