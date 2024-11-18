import { Box, IconButton, useColorMode } from "@chakra-ui/react";
import { FaMoon } from "react-icons/fa6";
import { GoSun } from "react-icons/go";
import useNavIconColor from "../hooks/useNavIconColor";

const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const backgroundColor = useNavIconColor();

  return (
    <Box width="auto" alignSelf="center">
      <IconButton
        aria-label="Toggle color mode"
        icon={colorMode === "dark" ? <GoSun /> : <FaMoon />}
        onClick={toggleColorMode}
        variant="ghost"
        size="lg"
        fontSize="1.5rem"
        colorScheme={backgroundColor}
      />
    </Box>
  );
};

export default ColorModeSwitch;
