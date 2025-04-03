import { useColorMode } from "@chakra-ui/react";

/**
 * Custom hook to determine bounding box fill color based on current color mode.
 *
 * - Uses a darker shade in light mode and a lighter shade in dark mode
 *   to provide appropriate contrast with the UI.
 *
 * @returns A Chakra UI color token string (e.g. "gray.700" or "gray.100")
 */
const useBoundingBoxColor = () => {
  const { colorMode } = useColorMode();

  return colorMode === "dark" ? "gray.700" : "gray.100";
};

export default useBoundingBoxColor;
