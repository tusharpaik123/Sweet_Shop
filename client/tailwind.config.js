/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary color scheme
        cream: {
          DEFAULT: '#F7F6EF',
          light: '#FFFDF5',
          dark: '#F5F5DC',
        },
        chocolate: {
          DEFAULT: '#4E342E',
          light: '#6D4C41',
          dark: '#3E2723',
        },
        saffron: {
          DEFAULT: '#FF9800',
          light: '#FFB300',
          dark: '#F57C00',
        },
        
        // Additional semantic colors
        primary: '#4E342E',
        secondary: '#FF9800',
        accent: '#FFB300',
        background: '#F7F6EF',
        surface: '#FFFDF5',
        error: '#D32F2F',
        warning: '#FF9800',
        success: '#388E3C',
        info: '#1976D2',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #F7F6EF 0%, #FFFDF5 100%)',
        'gradient-chocolate': 'linear-gradient(135deg, #4E342E 0%, #6D4C41 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FF9800 0%, #FFB300 100%)',
      },
      boxShadow: {
        'warm': '0 4px 14px 0 rgba(255, 152, 0, 0.15)',
        'chocolate': '0 4px 14px 0 rgba(78, 52, 46, 0.15)',
        'cream': '0 4px 14px 0 rgba(247, 246, 239, 0.15)',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
