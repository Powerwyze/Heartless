export interface Theme {
  name: string;
  id: string;
  colors: {
    primary: string;
    primaryHover: string;
    primaryGlow: string;
    accent: string;
    accentHover: string;
    accentGlow: string;
  };
}

export const themes: Theme[] = [
  {
    name: 'Pink Dream',
    id: 'pink',
    colors: {
      primary: '#ec4899', // pink-500
      primaryHover: '#f472b6', // pink-400
      primaryGlow: 'rgba(236, 72, 153, 0.8)',
      accent: '#c084fc', // purple-400
      accentHover: '#d8b4fe', // purple-300
      accentGlow: 'rgba(192, 132, 252, 0.8)',
    },
  },
  {
    name: 'Ocean Blue',
    id: 'blue',
    colors: {
      primary: '#3b82f6', // blue-500
      primaryHover: '#60a5fa', // blue-400
      primaryGlow: 'rgba(59, 130, 246, 0.8)',
      accent: '#06b6d4', // cyan-500
      accentHover: '#22d3ee', // cyan-400
      accentGlow: 'rgba(6, 182, 212, 0.8)',
    },
  },
  {
    name: 'Sunset Orange',
    id: 'yellow',
    colors: {
      primary: '#f59e0b', // amber-500
      primaryHover: '#fbbf24', // amber-400
      primaryGlow: 'rgba(245, 158, 11, 0.8)',
      accent: '#ef4444', // red-500
      accentHover: '#f87171', // red-400
      accentGlow: 'rgba(239, 68, 68, 0.8)',
    },
  },
  {
    name: 'Emerald Green',
    id: 'green',
    colors: {
      primary: '#10b981', // emerald-500
      primaryHover: '#34d399', // emerald-400
      primaryGlow: 'rgba(16, 185, 129, 0.8)',
      accent: '#14b8a6', // teal-500
      accentHover: '#2dd4bf', // teal-400
      accentGlow: 'rgba(20, 184, 166, 0.8)',
    },
  },
  {
    name: 'Royal Purple',
    id: 'purple',
    colors: {
      primary: '#8b5cf6', // violet-500
      primaryHover: '#a78bfa', // violet-400
      primaryGlow: 'rgba(139, 92, 246, 0.8)',
      accent: '#d946ef', // fuchsia-500
      accentHover: '#e879f9', // fuchsia-400
      accentGlow: 'rgba(217, 70, 239, 0.8)',
    },
  },
  {
    name: 'Monochrome',
    id: 'grey',
    colors: {
      primary: '#6b7280', // gray-500
      primaryHover: '#9ca3af', // gray-400
      primaryGlow: 'rgba(107, 114, 128, 0.8)',
      accent: '#4b5563', // gray-600
      accentHover: '#6b7280', // gray-500
      accentGlow: 'rgba(75, 85, 99, 0.8)',
    },
  },
  {
    name: 'Cherry Red',
    id: 'red',
    colors: {
      primary: '#ef4444', // red-500
      primaryHover: '#f87171', // red-400
      primaryGlow: 'rgba(239, 68, 68, 0.8)',
      accent: '#fb7185', // rose-400
      accentHover: '#fda4af', // rose-300
      accentGlow: 'rgba(251, 113, 133, 0.8)',
    },
  },
];

export const getTheme = (themeId: string): Theme => {
  return themes.find(t => t.id === themeId) || themes[0];
};
