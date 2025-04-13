module.exports = {
  // ...existing config...
  theme: {
    extend: {
      // ...existing theme extensions...
    },
  },
  plugins: [
    // ...existing plugins...
    function({ addUtilities }) {
      addUtilities({
        '.no-scrollbar::-webkit-scrollbar': {
          'display': 'none',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      });
    },
  ],
};