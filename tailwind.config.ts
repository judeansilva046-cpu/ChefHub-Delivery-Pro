import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        chefhub: {
          'dark-blue': '#0B1F3A',
          'orange': '#FF6B00',
          'white': '#FFFFFF',
          'light-gray': '#F5F5F5',
        }
      },
    },
  },
  plugins: [],
}
export default config
