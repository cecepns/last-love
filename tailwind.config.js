/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7924F9',
          700: "#6313db"
        },
      }
    },
    
  },
  plugins: [],
};

