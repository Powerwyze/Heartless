import React from 'react';

export const PixelButton: React.FC<{ 
  onClick?: () => void, 
  children: React.ReactNode, 
  variant?: 'primary' | 'secondary' | 'danger',
  className?: string,
  disabled?: boolean
}> = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const styles = {
    primary: 'bg-[#c084fc] hover:bg-[#d8b4fe] text-white shadow-[0_0_30px_rgba(192,132,252,0.8)] font-bold',
    secondary: 'bg-white/20 hover:bg-white/30 text-white border border-white/30 font-bold',
    danger: 'bg-[#fb7185] hover:bg-[#fda4af] text-white shadow-[0_0_30px_rgba(251,113,133,0.8)] font-bold',
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2.5 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const CompassionMeter: React.FC<{ current: number, max: number, big?: boolean }> = ({ current, max, big }) => {
  const hearts = [];
  for (let i = 1; i <= max; i++) {
    const size = big ? "w-6 h-6" : "w-4 h-4";
    const isActive = current >= i;
    const isHalf = !isActive && current >= i - 0.5;
    
    hearts.push(
      <svg 
        key={i} 
        viewBox="0 0 24 24" 
        className={`${size} ${isActive ? 'text-[color:var(--theme-primary)] fill-[color:var(--theme-primary)] drop-shadow-[0_0_5px_var(--theme-primary-glow)]' : isHalf ? 'text-[color:var(--theme-primary)] fill-[color:var(--theme-primary)] opacity-40' : 'text-white/10 fill-none'} transition-all`}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  return <div className="flex flex-wrap gap-1">{hearts}</div>;
};

export const StatBar: React.FC<{ label: string, value: number, color?: string }> = ({ label, value, color = 'bg-[#00f2ff]' }) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-1.5 px-1">
      <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">{label}</span>
      <span className="text-[11px] font-bold text-white/80">{value}%</span>
    </div>
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-1000 shadow-[0_0_10px_currentColor]`} 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

export const TagPill: React.FC<{ children: string, variant?: 'cyan' | 'pink' }> = ({ children, variant = 'cyan' }) => (
  <span className={`px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-widest ${variant === 'cyan' ? 'border-[#00f2ff]/30 text-[color:var(--theme-accent)] bg-[#00f2ff]/10' : 'border-[#ff007a]/30 text-[color:var(--theme-primary)] bg-[#ff007a]/10'}`}>
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
          <circle key={scale} cx={center} cy={center} r={radius * scale} fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
        ))}
        {/* Polygon */}
        <polygon points={points} fill="rgba(112, 0, 255, 0.2)" stroke="#7000ff" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(112,0,255,0.5)]" />
        {/* Labels */}
        {stats.map((s, i) => {
          const angle = (Math.PI * 2 * i) / stats.length - Math.PI / 2;
          const x = center + (radius + 20) * Math.cos(angle);
          const y = center + (radius + 20) * Math.sin(angle);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="9" fontWeight="bold" className="uppercase tracking-widest">
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative glass w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Scanlines: React.FC = () => null; // Removed scanlines for modern look
