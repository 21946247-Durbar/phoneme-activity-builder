/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // Phoneme keyboard colors returned dynamically by getPhonemeColor()
    'bg-red-500', 'hover:bg-red-600',
    'bg-purple-500', 'hover:bg-purple-600',
    'bg-yellow-500', 'hover:bg-yellow-600',
    'bg-green-500', 'hover:bg-green-600',
    'bg-blue-500', 'hover:bg-blue-600',
    'bg-pink-500', 'hover:bg-pink-600',
    'bg-gray-500', 'hover:bg-gray-600',

    // Wordle grid state classes
    'grid-cell', 'grid-cell.correct', 'grid-cell.present', 'grid-cell.absent', 'grid-cell.empty',

    // Word search cell states
    'word-search-cell', 'word-search-cell.found',
    'word-search-cell.highlighted', 'word-search-cell.selected',

    // Phoneme key base
    'phoneme-key',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        phoneme: {
          plosive: '#ef4444',
          nasal: '#8b5cf6',
          fricative: '#f59e0b',
          approximant: '#10b981',
          monophthong: '#3b82f6',
          diphthong: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};