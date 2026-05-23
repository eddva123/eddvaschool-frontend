/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#EFF8FF',
          100: '#DBEEFF',
          200: '#BDE2FF',
          300: '#8BD0FF',
          400: '#52B8FF',
          500: '#1D9BF0',
          600: '#0879D6',
          700: '#0057C2',
          800: '#0646A0',
          900: '#083A7D',
          950: '#052653',
        },
        surface: {
          50: '#F8FBFF',
          100: '#EEF5FF',
          200: '#D8E7FA',
          300: '#B9CEE8',
          400: '#8EA9C7',
          500: '#6887A8',
          600: '#4D6889',
          700: '#3C516E',
          800: '#263C59',
          900: '#172B45',
          950: '#0B1A2E',
        },
        primary: '#0057C2',
        secondary: '#38BDF8',
        accent: '#0EA5E9',
        success: '#16A34A',
        eddva: {
          blue: '#2563EB',
          'blue-soft': '#3B82F6',
          sky: '#60A5FA',
          purple: '#8B5CF6',
          green: '#10B981',
          orange: '#F59E0B',
          canvas: '#F8FAFC',
        },
      },
      backgroundImage: {
        'eddva-gradient': 'linear-gradient(135deg, #0057C2 0%, #0879D6 46%, #38BDF8 100%)',
        'eddva-hero': 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 38%, #3B82F6 72%, #60A5FA 100%)',
      },
      boxShadow: {
        glass: '0 16px 45px rgba(0, 87, 194, 0.08)',
        'glass-hover': '0 20px 55px rgba(8, 121, 214, 0.14)',
        soft: '0 16px 35px -18px rgba(23, 43, 69, 0.38)',
        blue: '0 16px 35px -18px rgba(0, 87, 194, 0.65)',
      },
      animation: {
        'fade-in': 'fadeIn 0.45s ease-out',
        'slide-up': 'slideUp 0.45s ease-out',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
