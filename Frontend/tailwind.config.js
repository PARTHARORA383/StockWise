import { Scale, scales } from 'chart.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        poppins : ['Poppins' , 'sans-serif']
      },
      colors: {
        'custom-lavender': '#b1a4d8',  // Adding your color with a custom name
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
          
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        popIn : 'popIn 0.3s ease-in-out',
        fadeOut : 'fadeOut 0.3s ease-out',
        popOut : 'popOut 0.3s ease-in-out'
      },
    },
  },
  plugins: [
    require('tailwindcss-filters'),
  ],
}

