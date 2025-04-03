import { Box, IconButton, Tooltip, useColorMode } from "@chakra-ui/react";
import { FaMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";
import { useNavIconColor } from "../../../hooks";

/**
 * ColorModeSwitch renders a button to toggle between light and dark color modes.
 * It displays a sun icon for light mode and a moon icon for dark mode, and shows
 * a tooltip to indicate the action. The button's color scheme adjusts based on the current color mode.
 *
 * The component uses Chakra UI's `useColorMode` hook to control the color mode state.
 * It also uses a custom hook `useNavIconColor` to set the color scheme of the icon based on the current mode.
 *
 * @returns {JSX.Element} A button that toggles between light and dark mode.
 */
const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const backgroundColor = useNavIconColor();

  return (
    <Box width="auto" alignSelf="center">
      <Tooltip
        label={
          colorMode === "dark" ? "Deactivate dark mode" : "Activate dark mode"
        }
        placement="top-start"
      >
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === "dark" ? <GoSun /> : <FaMoon />}
          onClick={toggleColorMode}
          variant="ghost"
          size="lg"
          fontSize="1.5rem"
          colorScheme={backgroundColor}
        />
      </Tooltip>
    </Box>
  );
};

export default ColorModeSwitch;
