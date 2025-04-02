import { useColorModeValue } from "@chakra-ui/react";

const useButtonThemedColor = () => {
  const backgroundColor = useColorModeValue("gray.400", "gray.500");
  const borderColor = useColorModeValue("gray.800", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.900");
  const hoverBorder = useColorModeValue("blue.500", "blue.300");
  const hoverBackgroundColor = useColorModeValue("gray.600", "gray.400");

  return {
    backgroundColor,
    borderColor,
    textColor,
    hoverBorder,
    hoverBackgroundColor,
  };
};

export default useButtonThemedColor;
