import { useColorMode } from "@chakra-ui/react";

const useActiveParentColor = () => {
  const { colorMode } = useColorMode();

  return colorMode === "dark" ? "teal.900" : "blackAlpha.400";
};

export default useActiveParentColor;
