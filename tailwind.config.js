/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1B4332',
          light: '#2D6A4F',
          dark: '#081c15',
          50: '#e8f5e9',
          100: '#c8e6c9',
          800: '#1b4332',
          900: '#081c15',
        },
        income: {
          DEFAULT: '#40916C',
          light: '#52B788',
          bg: '#EAF5EF',
          border: '#B7E4C7',
          dark: '#1B4332',
        },
        expense: {
          DEFAULT: '#BC6C25',
          light: '#DDA15E',
          bg: '#FDF6EE',
          border: '#E9C496',
          dark: '#934F14',
        },
        app: {
          bg: '#F8F7F2',
          surface: '#FFFFFF',
          text: '#1F2937',
          muted: '#6B7280',
          border: '#E5E7EB',
          subtle: '#F3F4F6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 8px 24px -4px rgba(27, 67, 50, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
