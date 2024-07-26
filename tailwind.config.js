/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      minHeight: {
        page: 'var(--page-height)',
      },
      maxHeight: {
        page: 'var(--page-height)',
      },
    },
  },
  plugins: [],
};
