/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./admin/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./admin/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--tg-theme-bg-color)',
        text: 'var(--tg-theme-text-color)',
        hint: 'var(--tg-theme-hint-color)',
        link: 'var(--tg-theme-link-color)',
        button: 'var(--tg-theme-button-color)',
        'button-outline-bg-light': '#2481cc33',
        'button-outline-fg-light': '#2481cc',
        'button-outline-bg-dark': '#2ea6ff33',
        'button-outline-fg-dark': '#2ea6ff',
        'button-text': 'var(--tg-theme-button-text-color)',
        'secondary-bg': 'var(--tg-theme-secondary-bg-color)',


        success: '#2ecb47',
        'success-light': 'rgba(46, 203, 71, 0.4)',
        danger: '#fc2025',
        'danger-light': 'rgba(252, 32, 37, 0.4)',
        orange: '#FF9F0A',

        'orange-100': 'oklch(0.954 0.038 75.164)',
        'orange-700': 'oklch(0.553 0.195 38.402)',
        'slate-100': 'oklch(0.968 0.007 247.896)',
        'slate-700': 'oklch(0.372 0.044 257.287)',
        'separator-dark': 'rgb(33,48,64)',

        divider: 'rgba(0, 0, 0, .05)',

        'icon-pink': '#c72ab9',
        'icon-violet': '#5454d6',
        'icon-blue': '#0e77f1',
        'icon-turquoise': '#16a6c3',
        'icon-sea': '#1abe8a',
        'icon-green': '#1edb59',
      },
      boxShadow: {
        DEFAULT: '0 12px 24px 0 rgba(0, 0, 0, .05)'
      },
      zIndex: {
        'confirm-alert': 1000,
        'bottom-sheet-fg': 1000,
        'bottom-sheet-bg': 999,
        'main-button': 999
      },
      spacing: {
        'card': 'var(--card-size)',
        'card-half': 'calc(var(--card-size) / 2)'
      },
      width: {
        'card': 'var(--card-size)'
      },
      height: {
        'card': 'var(--card-size)'
      }
    }
  },
  plugins: [],
}
