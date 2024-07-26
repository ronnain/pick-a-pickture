/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // orange: '#FB8500',
        // yellow: '#FFB703',
        // black: '#023047',
        // blue: '#219EBC',
        // 'light-blue': '#8EE4AF',
        yellow: '#FFD700',
        blue: '#87CEEB',
        red: '#FF6347',
        green: '#98FF98',
        purple: '#E6E6FA',
        orange: '#FFA500',
        pink: '#FF69B4',
        teal: '#20B2AA',
        white: '#FFFFFF',
        'light-gray': '#F0F0F0',
        'dark-gray': '#333333',
      },
      fontFamily: {
        pacifico: ['Pacifico', 'cursive'],
        lora: ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
};
