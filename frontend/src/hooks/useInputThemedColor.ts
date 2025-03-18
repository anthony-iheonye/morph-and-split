import { useColorModeValue } from "@chakra-ui/react";

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
