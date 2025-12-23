/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'var(--accent)',
          400: 'var(--accent-400)',
          600: 'var(--accent-600)',
        },
        surface: 'var(--surface)',
        card: 'var(--card)',
        chip: 'var(--chip)',
        muted: 'var(--muted)',
        border: 'var(--border)'
      }
    },
  },
  plugins: [],
};
