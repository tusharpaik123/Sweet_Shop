/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-primary': '#0f172a',
        'light-blue': '#1e40af', 
        'slate-gray': '#475569',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
