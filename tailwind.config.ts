import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#070b14',
        panel: 'rgba(12, 18, 31, 0.78)',
        glowPink: '#ff3b8a',
        glowCyan: '#22d3ee',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(circle at top, rgba(255,59,138,0.18), transparent 35%), radial-gradient(circle at bottom right, rgba(34,211,238,0.18), transparent 30%)',
      },
      boxShadow: {
        neon: '0 0 30px rgba(34, 211, 238, 0.18), 0 0 45px rgba(255, 59, 138, 0.14)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
