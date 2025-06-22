module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
        screens: {
          lg: "1140px",
          xl: "1140px",
          "2xl": "1500px",
        },
      },
      colors: {
        primary: {
          DEFAULT: "#EFE9E8",
        },
        secondary: {
          DEFAULT: "#C1333D",
        },
        grey: {
          DEFAULT: "#757575",
          90: "#8C8C8C",
          80: "#A3A3A3",
          70: "#BABABA",
          60: "#D1D1D1",
          50: "#E8E8E8",
        },
        green: {
          DEFAULT: "#76b91b",
        },
      },
      fontFamily: {
        serif: ["Helvetica"],
      },
    },
  },
  plugins: [],
};
