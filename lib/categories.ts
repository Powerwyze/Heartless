import React from 'react';

// Four relationship categories. Each carries its own 16-bit pixel meter icon,
// gradient color pair, and meter label. The icons follow the same aesthetic as
// HrtlessLogo's heart: one <rect> per pixel on a 14x12 grid, a 4-tone palette
// (1=outline, 2=shadow, 3=base, 4=highlight), crisp edges, no anti-aliasing.

export type RelationshipCategory = 'romantic' | 'business' | 'friend' | 'family';

type IconProps = { size?: number; filled?: boolean; className?: string };

const COLS = 14;
const ROWS = 12;

// Shared pixel-grid renderer. `filled` toggles between the full color palette
// and a dimmed "empty" look (used by the meter to show inactive units).
const PixelSprite: React.FC<{
  grid: number[][];
  palette: Record<number, string>;
  size: number;
  filled: boolean;
  className?: string;
  label: string;
}> = ({ grid, palette, size, filled, className = '', label }) => {
  const rects: React.ReactNode[] = [];
  grid.forEach((row, y) => {
    row.forEach((v, x) => {
      if (v === 0) return;
      const fill = filled ? palette[v] : (v === 1 ? '#3a3a3a' : '#222222');
      rects.push(
        React.createElement('rect', {
          key: `${x}-${y}`,
          x,
          y,
          width: 1.02,
          height: 1.02,
          fill,
        })
      );
    });
  });
  return React.createElement(
    'svg',
    {
      viewBox: `0 0 ${COLS} ${ROWS}`,
      width: size,
      height: size,
      preserveAspectRatio: 'xMidYMid meet',
      shapeRendering: 'crispEdges',
      className,
      role: 'img',
      'aria-label': label,
      style: { imageRendering: 'pixelated' as const },
    },
    rects
  );
};

// --- Sprites -------------------------------------------------------------

// Heart (Romantic) — same silhouette as HrtlessLogo.
const HEART_GRID: number[][] = [
  [0,0,1,1,1,0,0,0,1,1,1,0,0,0],
  [0,1,4,4,3,1,0,1,3,3,3,1,0,0],
  [1,4,4,4,3,3,1,3,3,3,2,2,1,0],
  [1,4,4,3,3,3,3,3,3,3,2,2,2,1],
  [1,4,3,3,3,3,3,3,3,3,2,2,2,1],
  [1,3,3,3,3,3,3,3,3,3,2,2,2,1],
  [0,1,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,0,1,3,3,3,3,3,3,3,2,1,0,0],
  [0,0,0,1,3,3,3,3,3,3,1,0,0,0],
  [0,0,0,0,1,3,3,3,3,1,0,0,0,0],
  [0,0,0,0,0,1,3,3,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,0,0,0,0,0,0],
];

// Briefcase (Business).
const BRIEFCASE_GRID: number[][] = [
  [0,0,0,0,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,1,3,3,3,3,3,1,0,0,0,0],
  [0,0,0,1,4,1,1,1,3,1,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [1,4,4,3,3,3,3,3,3,3,3,2,1,0],
  [1,4,3,3,3,3,3,3,3,3,3,2,1,0],
  [1,3,3,3,1,1,1,1,3,3,3,2,1,0],
  [1,3,3,3,1,4,4,1,3,3,3,2,1,0],
  [1,3,3,3,1,1,1,1,3,3,3,2,1,0],
  [1,3,3,3,3,3,3,3,3,3,3,2,1,0],
  [1,2,2,2,2,2,2,2,2,2,2,2,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,0,0],
];

// Handshake (Friend) — two clasped pixel hands.
const HANDSHAKE_GRID: number[][] = [
  [0,0,0,0,0,0,0,0,0,1,1,0,0,0],
  [0,0,1,1,0,0,0,0,1,4,3,1,0,0],
  [0,1,4,3,1,1,1,1,3,3,3,1,0,0],
  [1,4,3,3,3,3,3,3,3,3,2,1,0,0],
  [1,4,3,3,3,3,3,3,3,2,2,1,0,0],
  [1,3,3,1,1,3,3,1,1,2,2,1,0,0],
  [1,3,3,3,1,1,1,1,3,2,2,1,0,0],
  [1,3,3,3,3,3,3,3,3,2,2,1,0,0],
  [0,1,3,3,3,3,3,3,2,2,1,0,0,0],
  [0,0,1,3,3,3,3,2,2,1,0,0,0,0],
  [0,0,0,1,1,2,2,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,0,0,0,0,0,0],
];

// Two figures embracing (Family) — a hug/bond glyph.
const HUG_GRID: number[][] = [
  [0,0,1,1,0,0,0,0,0,0,1,1,0,0],
  [0,1,4,3,1,0,0,0,0,1,3,3,1,0],
  [0,1,3,3,1,0,0,0,0,1,3,2,1,0],
  [0,0,1,1,0,0,0,0,0,0,1,1,0,0],
  [0,1,1,1,1,1,0,0,1,1,1,1,1,0],
  [1,4,3,3,3,3,1,1,3,3,3,2,2,1],
  [1,4,3,3,3,3,3,3,3,3,3,2,2,1],
  [1,3,3,3,3,3,3,3,3,3,3,2,2,1],
  [0,1,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,3,3,1,1,1,1,1,3,2,2,1,0],
  [0,1,1,1,0,0,0,0,1,1,1,1,0,0],
];

// --- Palettes ------------------------------------------------------------

const HEART_PALETTE = { 1: '#3a0a0a', 2: '#8b0d1a', 3: '#ec4899', 4: '#fb7185' };
const BRIEFCASE_PALETTE = { 1: '#3a2606', 2: '#a8730a', 3: '#f59e0b', 4: '#fbbf24' };
const HANDSHAKE_PALETTE = { 1: '#053a2a', 2: '#0a7a55', 3: '#10b981', 4: '#34d399' };
const HUG_PALETTE = { 1: '#2a0a4a', 2: '#5b2d9c', 3: '#8b5cf6', 4: '#a78bfa' };

const makeIcon =
  (grid: number[][], palette: Record<number, string>, label: string): React.FC<IconProps> =>
  ({ size = 18, filled = true, className }) =>
    React.createElement(PixelSprite, { grid, palette, size, filled, className, label });

export const HeartIcon = makeIcon(HEART_GRID, HEART_PALETTE, 'Compassion');
export const BriefcaseIcon = makeIcon(BRIEFCASE_GRID, BRIEFCASE_PALETTE, 'Trust');
export const HandshakeIcon = makeIcon(HANDSHAKE_GRID, HANDSHAKE_PALETTE, 'Loyalty');
export const HugIcon = makeIcon(HUG_GRID, HUG_PALETTE, 'Bond');

// --- Config --------------------------------------------------------------

export interface CategoryConfig {
  label: string;
  meterLabel: string;
  // Literal Tailwind classes (not dynamically built) so the scanner keeps them.
  colorClass: string;   // solid bg dot/accent
  textClass: string;    // accent text
  borderClass: string;  // accent border (with alpha)
  color: string;        // base hex (gradient start)
  colorTo: string;      // gradient end hex
  icon: React.FC<IconProps>;
}

export const CATEGORY_CONFIG: Record<RelationshipCategory, CategoryConfig> = {
  romantic: { label: 'Romantic', meterLabel: 'Compassion', colorClass: 'bg-rose-500',    textClass: 'text-rose-400',    borderClass: 'border-rose-500/40',    color: '#ec4899', colorTo: '#fb7185', icon: HeartIcon },
  business: { label: 'Business', meterLabel: 'Trust',      colorClass: 'bg-amber-500',   textClass: 'text-amber-400',   borderClass: 'border-amber-500/40',   color: '#f59e0b', colorTo: '#fbbf24', icon: BriefcaseIcon },
  friend:   { label: 'Friend',   meterLabel: 'Loyalty',    colorClass: 'bg-emerald-500', textClass: 'text-emerald-400', borderClass: 'border-emerald-500/40', color: '#10b981', colorTo: '#34d399', icon: HandshakeIcon },
  family:   { label: 'Family',   meterLabel: 'Bond',       colorClass: 'bg-violet-500',  textClass: 'text-violet-400',  borderClass: 'border-violet-500/40',  color: '#8b5cf6', colorTo: '#a78bfa', icon: HugIcon },
};

export const CATEGORY_ORDER: RelationshipCategory[] = ['romantic', 'business', 'friend', 'family'];

export const isRelationshipCategory = (v: unknown): v is RelationshipCategory =>
  v === 'romantic' || v === 'business' || v === 'friend' || v === 'family';
