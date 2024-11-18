import { HStack, IconButton, useColorMode } from "@chakra-ui/react";
import { FaMoon } from "react-icons/fa6";
import { GoSun } from "react-icons/go";

const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <HStack>
      <IconButton
        aria-label="Toggle color mode"
        icon={colorMode === "dark" ? <GoSun /> : <FaMoon />}
        onClick={toggleColorMode}
        variant="ghost"
        size="lg"
        fontSize="1.5rem"
        colorScheme={colorMode === "dark" ? "yellow" : "gray"}
      />
    </HStack>
  );
};

export default ColorModeSwitch;
