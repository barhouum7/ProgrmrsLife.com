/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./node_modules/flowbite/**/*.js",
    './node_modules/flowbite-react/**/*.js',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  // safelist: [{
  //   pattern: /hljs+/,
  // }],
  theme: {
    // hljs: {
    //   theme: 'atom-one-dark',
    // },
    extend: {
      animation: {
        'spin': 'spin 6s linear infinite',
        'ping-slow': 'ping 4s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fadeIn': 'fadeIn 0.2s ease-in-out',
        'gradient': 'gradient 3s linear infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': '0% 50%'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': '100% 50%'
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
    }
  },
  plugins: [
    require("flowbite/plugin"),
    // require('tailwind-highlightjs')
  ],
}
