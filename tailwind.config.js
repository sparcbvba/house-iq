module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.ejs',
    "./node_modules/flowbite/**/*.js"
  ],
  plugins: [
    require('@tailwindcss/forms'),
    require('flowbite/plugin'),
    require('flowbite/plugin')({
      charts: true,
    })
  ]
}
