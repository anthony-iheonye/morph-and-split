import { useColorMode } from "@chakra-ui/react";

const useNavIconColor = () => {
  const { colorMode } = useColorMode();

  return colorMode === "dark" ? "teal" : undefined;
};

export default useNavIconColor;
