/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'reminisce': {
          'black': '#000000',
          'purple': '#C7B8EA',
          'light-gray': '#D0CED0',
          'gray': '#D3D3D3',
          'transparent-80': '#D9D9D980',
          'transparent-26': '#D9D9D926',
          'white': '#FFFFFF',
          'brand': '#A185E2',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      fontWeight: {
        'regular': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      }
    },
  },
  plugins: [],
}

