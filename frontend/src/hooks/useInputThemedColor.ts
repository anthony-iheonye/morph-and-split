import { useColorModeValue } from "@chakra-ui/react";

/**
 * Custom hook to provide Chakra UI input field colors based on the active color mode.
 *
 * Returns appropriate values for:
 * - `backgroundColor`: Base background color of the input field
 * - `borderColor`: Border color of the input field
 * - `textColor`: Text color inside the input
 * - `focusBorder`: Border color when input is focused
 * - `focusedBackgroundColor`: Background color when input is focused
 *
 * @returns An object containing theming values for input components
 */
const useInputThemedColor = () => {
  const backgroundColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const focusBorder = useColorModeValue("blue.500", "blue.300");
  const focusedBackgroundColor = useColorModeValue("gray.50", "gray.700");

  return {
    backgroundColor,
    borderColor,
    textColor,
    focusBorder,
    focusedBackgroundColor,
  };
};

export default useInputThemedColor;
