/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base:     '#0D1117',
        surface:  '#161B22',
        border:   '#30363D',
        teal:     '#00D9B8',
        red:      '#FF3B30',
        amber:    '#F59E0B',
        orange:   '#FF6B00',
        textPrimary:   '#F0F4F8',
        textSecondary: '#8B949E',
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'] },
      animation: {
        'slide-down': 'slideDown 0.4s ease',
        'pop':        'markerPop 0.4s ease',
        'fade-in':    'fadeIn 0.5s ease',
        'pulse-red':  'pulseRed 1.5s infinite',
      }
    }
  },
  plugins: [],
}