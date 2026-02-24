/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy:    '#0b1f3a',
        navy2:   '#112848',
        navy3:   '#1a3a5c',
        orange:  '#f96a1b',
        orange2: '#ff8c47',
        muted:   '#6b88a8',
        rule:    '#1e3550',
        ftext:   '#ccd9ea',
        dim:     '#3a5472',
      },
      fontFamily: {
        bebas:  ['var(--font-bebas)'],
        barlow: ['var(--font-barlow)'],
        barlowc: ['var(--font-barlowc)'],
      },
    },
  },
  plugins: [],
}
