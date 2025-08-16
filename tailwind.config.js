/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          primary: '#5865F2',
          secondary: '#4752C4',
          dark: '#36393F',
          darker: '#2F3136',
          darkest: '#202225',
          light: '#40444B',
          lighter: '#4F545C',
          text: '#DCDDDE',
          textMuted: '#72767D',
          success: '#43B581',
          danger: '#F04747',
          warning: '#FAA61A',
        }
      },
      fontFamily: {
        'discord': ['Whitney', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
