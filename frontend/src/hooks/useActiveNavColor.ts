import { useColorMode } from "@chakra-ui/react";

const useActiveNavColor = () => {
  const { colorMode } = useColorMode();

  return colorMode === "dark"
    ? { parentColor: "teal.900", subParentColor: "teal.700" }
    : { parentColor: "blackAlpha.400", subParentColor: "blackAlpha.200" };
};

export default useActiveNavColor;
