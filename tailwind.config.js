/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(204 94% 51%)',
        accent: 'hsl(171 74% 45%)',
        bg: 'hsl(210 36% 98%)',
        surface: 'hsl(210 36% 96%)',
        'text-primary': 'hsl(222.2 47.4% 11.2%)',
        'text-secondary': 'hsl(210 40% 41%)',
        'dark-bg': 'hsl(220 26% 14%)',
        'dark-surface': 'hsl(220 26% 18%)',
        'dark-border': 'hsl(220 26% 22%)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      spacing: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(222, 47%, 11%, 0.08)',
        'dark-card': '0 4px 12px hsla(220, 26%, 8%, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
