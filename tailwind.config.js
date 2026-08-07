/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  corePlugins: {
    preflight: false,
    container: false,
  },
  theme: {
    extend: {
      colors: {
        cream: '#FFF9F4',
        primary: '#FFC107',
        primaryDark: '#E6A900',
        ink: '#1E293B',
        body: '#64748B',
        accent: '#FDE68A',
      },
      fontFamily: {
        display: ['Poppins', 'Plus Jakarta Sans', 'Manrope', 'sans-serif'],
      },
      maxWidth: {
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
}
