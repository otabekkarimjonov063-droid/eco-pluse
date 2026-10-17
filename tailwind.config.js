/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        moss: 'rgb(var(--color-moss) / <alpha-value>)',
        bone: 'rgb(var(--color-bone) / <alpha-value>)',
        mist: 'rgb(var(--color-mist) / <alpha-value>)',
        signal: 'rgb(var(--color-signal) / <alpha-value>)',
        ember: 'rgb(var(--color-ember) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
