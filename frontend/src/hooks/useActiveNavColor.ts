import { useColorMode } from "@chakra-ui/react";

/**
 * Custom hook to determine navigation highlight colors based on the current color mode.
 *
 * - In dark mode: returns teal shades for better contrast
 * - In light mode: returns subtle black alpha shades
 *
 * @returns An object with `parentColor` and `subParentColor` values
 */
const useActiveNavColor = () => {
  const { colorMode } = useColorMode();

  return colorMode === "dark"
    ? { parentColor: "teal.900", subParentColor: "teal.700" }
    : { parentColor: "blackAlpha.400", subParentColor: "blackAlpha.200" };
};

export default useActiveNavColor;
