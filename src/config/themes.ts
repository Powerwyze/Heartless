export interface Theme {
  name: string;
  id: string;
  colors: {
    // Primary accent color
    primary: string;
    primaryHover: string;
    // Secondary accent
    accent: string;
    accentHover: string;
    // Backgrounds
    bg: string;
    bgAlt: string;
    surface: string;
    // Text colors
    text: string;
    textMuted: string;
    textSubtle: string;
    // Borders
    border: string;
    borderHover: string;
  };
}

export const themes: Theme[] = [
  {
    name: 'Slate',
    id: 'slate',
    colors: {
      primary: '#94A3B8',
      primaryHover: '#CBD5E1',
      accent: '#64748B',
      accentHover: '#94A3B8',
      bg: '#0a0a0a',
      bgAlt: '#0f172a',
      surface: '#1e293b',
      text: '#F0F6F7',
      textMuted: '#94A3B8',
      textSubtle: '#64748B',
      border: '#334155',
      borderHover: '#475569',
    },
  },
  {
    name: 'Warm Gray',
    id: 'warm',
    colors: {
      primary: '#D6D3D1',
      primaryHover: '#F5F5F4',
      accent: '#A8A29E',
      accentHover: '#D6D3D1',
      bg: '#0c0a09',
      bgAlt: '#1c1917',
      surface: '#292524',
      text: '#F5F5F4',
      textMuted: '#A8A29E',
      textSubtle: '#78716C',
      border: '#44403C',
      borderHover: '#57534E',
    },
  },
  {
    name: 'Ocean',
    id: 'ocean',
    colors: {
      primary: '#67E8F9',
      primaryHover: '#A5F3FC',
      accent: '#22D3EE',
      accentHover: '#67E8F9',
      bg: '#0a0a0a',
      bgAlt: '#0c1620',
      surface: '#0e2433',
      text: '#F0F6F7',
      textMuted: '#67E8F9',
      textSubtle: '#0891B2',
      border: '#164E63',
      borderHover: '#0E7490',
    },
  },
  {
    name: 'Amber',
    id: 'amber',
    colors: {
      primary: '#FCD34D',
      primaryHover: '#FDE68A',
      accent: '#F59E0B',
      accentHover: '#FCD34D',
      bg: '#0a0a0a',
      bgAlt: '#1a1406',
      surface: '#292211',
      text: '#F0F6F7',
      textMuted: '#FCD34D',
      textSubtle: '#B45309',
      border: '#78350F',
      borderHover: '#92400E',
    },
  },
  {
    name: 'Rose',
    id: 'rose',
    colors: {
      primary: '#FB7185',
      primaryHover: '#FDA4AF',
      accent: '#F43F5E',
      accentHover: '#FB7185',
      bg: '#0a0a0a',
      bgAlt: '#1a0b12',
      surface: '#2a1520',
      text: '#F0F6F7',
      textMuted: '#FDA4AF',
      textSubtle: '#FB7185',
      border: '#4c1d2a',
      borderHover: '#6b2233',
    },
  },
  {
    name: 'Emerald',
    id: 'emerald',
    colors: {
      primary: '#34D399',
      primaryHover: '#6EE7B7',
      accent: '#10B981',
      accentHover: '#34D399',
      bg: '#0a0a0a',
      bgAlt: '#0c1611',
      surface: '#122019',
      text: '#F0F6F7',
      textMuted: '#6EE7B7',
      textSubtle: '#10B981',
      border: '#14532D',
      borderHover: '#166534',
    },
  },
  {
    name: 'Lavender',
    id: 'lavender',
    colors: {
      primary: '#C4B5FD',
      primaryHover: '#DDD6FE',
      accent: '#A78BFA',
      accentHover: '#C4B5FD',
      bg: '#0a0a0a',
      bgAlt: '#140f1f',
      surface: '#221a33',
      text: '#F0F6F7',
      textMuted: '#C4B5FD',
      textSubtle: '#A78BFA',
      border: '#312E81',
      borderHover: '#4338CA',
    },
  },
  {
    name: 'Sunset',
    id: 'sunset',
    colors: {
      primary: '#FDBA74',
      primaryHover: '#FED7AA',
      accent: '#FB923C',
      accentHover: '#FDBA74',
      bg: '#0a0a0a',
      bgAlt: '#1b1209',
      surface: '#2a1b10',
      text: '#F0F6F7',
      textMuted: '#FDBA74',
      textSubtle: '#FB923C',
      border: '#7C2D12',
      borderHover: '#9A3412',
    },
  },
  {
    name: 'Cyber',
    id: 'cyber',
    colors: {
      primary: '#22D3EE',
      primaryHover: '#67E8F9',
      accent: '#A3E635',
      accentHover: '#BEF264',
      bg: '#0a0a0a',
      bgAlt: '#071416',
      surface: '#0b1f24',
      text: '#F0F6F7',
      textMuted: '#67E8F9',
      textSubtle: '#22D3EE',
      border: '#164E63',
      borderHover: '#0E7490',
    },
  },
];

export const getTheme = (themeId: string): Theme => {
  return themes.find(t => t.id === themeId) || themes[0];
};
