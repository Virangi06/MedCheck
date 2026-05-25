/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        skyblue: {
          50: "#F5FBFF",
          100: "#E5F3FD",
          200: "#D1E5F4",
          300: "#BDD5E7",
          400: "#AECCE4",
          500: "#9ABDDC",
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        md: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        lg: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
      },
    },
  },
  plugins: [],
}