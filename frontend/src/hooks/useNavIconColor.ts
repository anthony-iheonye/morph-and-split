import { useColorMode } from "@chakra-ui/react";

/**
 * Custom hook to determine the nav icon color based on the current color mode.
 *
 * @returns "teal" if in dark mode, otherwise undefined (uses default color)
 */
const useNavIconColor = () => {
  const { colorMode } = useColorMode();

  return colorMode === "dark" ? "teal" : undefined;
};

export default useNavIconColor;
