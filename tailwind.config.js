/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Mulish"', 'sans-serif'],
      },
      colors: {
        lobus: {
          bg: '#F4F6F9',
          obsidian: '#003882',
          cyan: '#00A3E0',
          violet: '#FFD300',
          primary: '#FFD300',
          primaryDark: '#003882',
          secondary: '#00A3E0',
          border: '#E2E8F0',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          neutral: '#64748B'
        }
      },
      boxShadow: {
        'glass': '0 4px 20px rgba(0, 56, 130, 0.08)',
        'neon': '0 0 10px rgba(255, 211, 0, 0.5)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'float': '0 10px 30px -5px rgba(0, 56, 130, 0.15)',
      },
      animation: {
        'enter': 'enter 0.4s cubic-bezier(0.2, 0.0, 0, 1.0)',
        'slide-up': 'slideUp 0.3s ease-out',
        'ripple': 'ripple 2s linear infinite',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        enter: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '0.6', borderWidth: '2px' },
          '100%': { transform: 'scale(2)', opacity: '0', borderWidth: '0px' },
        },
        pop: {
          '0%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}