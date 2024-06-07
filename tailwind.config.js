/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  corePlugin: {
    backgroundOpacity: true,
  },
  theme: {
    extend: {
      colors: {
        primary: '#040303',
        secondary: '#A13333',
        tab: '#461111',
        icon: '#B3541E',
      },
      fontFamily: {
        OutfitReg: ["Outfit-Regular"],
        OutfitBold: ["Outfit-Bold"],
        OutfitSB: ["Outfit-Semibold"],
      }
    },
  },
  plugins: [],
}