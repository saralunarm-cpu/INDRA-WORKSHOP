export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        canvas: '#EDE9DF',
        surface: '#FAF8F2',
        'surface-alt': '#F3F0E7',
        line: '#DFD9CA',
        ink: '#171812',
        'ink-soft': '#5D6055',
        brand: '#0FB6A0',
        'brand-strong': '#0A7F72',
        'brand-tint': '#E1F2EE',
        night: '#0E110F',
        'night-alt': '#171B18',
        cream: '#F5F2E9',
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
