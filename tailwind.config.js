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
  },
  plugins: [
    require("flowbite/plugin"),
    // require('tailwind-highlightjs')
  ],
}
