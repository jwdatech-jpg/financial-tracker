/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        'ibm': ['IBM Plex Sans', 'sans-serif'],
        'ibm-ar': ['IBM Plex Sans Arabic', 'sans-serif'],
      },
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
      }
    },
  },
  plugins: [],
}
