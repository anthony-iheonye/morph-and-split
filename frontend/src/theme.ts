import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// 2. Add color mode config
const config: ThemeConfig = {
  initialColorMode: "dark",
};

const theme = extendTheme({ config });

export default theme;
