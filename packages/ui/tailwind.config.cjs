/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      borderWidth: {
        thin: '0.3px',
      },
      ringWidth: {
        thin: '0.3px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addComponents }) {
      addComponents({
        '.flex-center': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        '.flex-between': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      });
    },
  ],
};
