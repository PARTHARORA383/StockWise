import { Scale, scales } from 'chart.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
      
        poppins : ['Poppins' , 'sans-serif'],
        poetsen: ["Poetsen One", "sans-serif"],
      },
      colors: {
        'custom-lavender': '#b1a4d8',  // Adding your color with a custom name

        supabaseGray: {
          DEFAULT: '#1A1A1A',
          dark: '#121212',
          light: '#2E2E2E',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        popIn : {
          '0%' : {
            opacity:'0',
            transform :'scale(0.8)'
          },
          "100%" : {
            opacity : '100',
            transform : 'scale(1)'
          }
        },
        popOut : {
          '0%' : {
            opacity:'100',
            transform :'scale(1)'
          },
          "100%" : {
            opacity : '0',
            transform : 'scale(0.8)'
          }
        }
        ,
        fadeOut : {
          '100%' : {opacity : '1'}, 
          "0%" : {opacity : '0'}
          
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.6s ease-out forwards',
        slideOut: 'slideOut 0.6s ease-out forwards',
        fadeIn: 'fadeIn 0.6s ease-in-out',
        popIn : 'popIn 0.3s ease-in-out',
        fadeOut : 'fadeOut 0.6s ease-out',
        popOut : 'popOut 0.3s ease-in-out'
      },
    },
  },
  plugins: [
    require('tailwindcss-filters'),
  ],
}

