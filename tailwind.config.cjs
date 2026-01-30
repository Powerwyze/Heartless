module.exports = {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        workos: {
          bg: '#0a0a0a',
          'bg-alt': '#111111',
          surface: '#141414',
          text: '#F0F6F7',
          muted: '#919FA5',
          subtle: '#747474',
          border: '#2a2a2a',
          'border-hover': '#3a3a3a',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'lg': '8px',
      },
      letterSpacing: {
        'label': '0.1em',
        'wide': '0.15em',
      },
    },
  },
  plugins: [],
};
