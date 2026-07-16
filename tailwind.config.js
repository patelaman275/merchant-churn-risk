/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // We will tie Tailwind theme variables back to our existing CSS custom properties
        bodyBg: 'var(--bg-body)',
        cardBg: 'var(--bg-card)',
        sidebarBg: 'var(--bg-sidebar)',
      }
    },
  },
  plugins: [],
}
