import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// 2. Add color mode config
const config: ThemeConfig = {
  initialColorMode: "dark",
};

// extend the theme
const theme = extendTheme({
  config,
  colors: {
    gray: {
      50: "#f9f9f9",
      100: "#ededed",
      200: "#d3d3d3",
      300: "#b3b3b3",
      400: "#a0a0a0",
      500: "#898989",
      600: "#6c6c6c",
      700: "#202020",
      800: "#121212",
      900: "#111",
    },
    blue: {
      50: "#e0f0ff",
      100: "#b8d5fa",
      200: "#8ebef1",
      300: "#63a8e8",
      400: "#3994e0",
      500: "#1f70c6",
      600: "#134d9b",
      700: "#082f70",
      800: "#001746",
      900: "#00061d",
    },
  },
});

export default theme;
