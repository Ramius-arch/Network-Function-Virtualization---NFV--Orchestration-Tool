/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-background, #010B13)',
        primary: 'var(--color-primary, #00FFFF)',
        secondary: 'var(--color-secondary, #00FF00)',
        accent: 'var(--color-accent, #FF00FF)',
        text: 'var(--color-text, #E0FFFF)',
        'gray-dark': '#1F2937',
        'gray-light': '#6B7280',
        success: '#00FF00',
        warning: '#FFFF00',
        error: '#FF0000',
      },
      fontFamily: {
        sans: ['"Orbitron"', 'sans-serif'], // Futuristic font
        mono: ['"Fira Code"', 'monospace'], // Monospace for code/data
      },
    },
  },
  plugins: [],
}