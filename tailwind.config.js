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
      }
    }
  },
  plugins: [
    require("flowbite/plugin"),
    // require('tailwind-highlightjs')
  ],
}
