import { useColorMode } from "@chakra-ui/react";

const useBoundingBoxColor = () => {
  const { colorMode } = useColorMode();

  return colorMode === "dark" ? "gray.700" : "gray.100";
};

export default useBoundingBoxColor;
