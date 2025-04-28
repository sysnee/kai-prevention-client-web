/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF8046',
        'pure-white': 'rgb(255, 255, 255)',
        'warm-white': 'rgb(254, 255, 252)',
        'mint-white': 'rgb(253, 255, 254)',
        'soft-blue': 'rgb(120, 162, 196)',
        'sage-white': 'rgb(254, 255, 253)',
        'ice-white': 'rgb(250, 255, 255)',
        'seafoam-white': 'rgb(249, 255, 254)',
        'azure-white': 'rgb(254, 255, 255)',
        'deep-blue': 'rgb(67, 98, 117)',
        'frost-white': 'rgb(245, 255, 255)',
        'orange-icon': '#FF8046',
        kai: {
          primary: '#FF8046',
          secondary: 'rgb(67, 98, 117)',    // deep-blue for secondary elements
          accent: 'rgb(249, 255, 254)',     // seafoam-white for accents
          background: 'rgb(254, 255, 255)', // azure-white for backgrounds
          surface: 'rgb(250, 255, 255)',    // ice-white for surface elements
          text: {
            primary: 'rgb(67, 98, 117)',    // deep-blue for primary text
            secondary: 'rgb(120, 162, 196)', // soft-blue for secondary text
          },
          icon: {
            primary: '#FF8046'
          },
          border: 'rgb(245, 255, 255)',     // frost-white for borders
          hover: 'rgb(253, 255, 254)',      // mint-white for hover states
          success: '#A9DC93',               // keeping the existing success color
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|text|border)-(kai|pure-white|warm-white|mint-white|soft-blue|sage-white|ice-white|seafoam-white|azure-white|deep-blue|frost-white)-([1-9]00|50)/,
    },
  ],
};