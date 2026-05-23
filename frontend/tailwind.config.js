/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        panel: '#111827',
        accent: '#f97316',
        accentSoft: '#fb923c',
      },
      boxShadow: {
        glow: '0 24px 80px rgba(249, 115, 22, 0.25)',
      },
    },
  },
  plugins: [],
}
