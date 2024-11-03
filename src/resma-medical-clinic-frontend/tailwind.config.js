/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Adjust this path according to your project's structure
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4673FF',
      },
      backgroundColor: {
       
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        shake: 'shake 0.5s ease-in-out infinite',
        'subtle-spin': 'subtleSpin 2s ease-in-out infinite',

      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, #81c9ff, #4673ff)',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        subtleSpin: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(5deg)' },  // Rotates only up to 30 degrees
        },

      },
    },
  },
  plugins: [],
}
