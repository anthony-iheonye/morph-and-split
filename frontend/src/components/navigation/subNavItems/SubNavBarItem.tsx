import {
  HStack,
  IconButton,
  PlacementWithLogical,
  Text,
  Tooltip,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { Link, To } from "react-router-dom";
import { handleLinkClick } from "../../../services";

interface Props {
  text: string | { base?: string; md?: string; lg?: string }; // Support both plain strings and responsive objects
  to: To;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  tooltipLabel?: string;
  icon: React.ReactElement;
  iconLabel: string;
  backgroundColor?: string;
  tooltipPlacement?: PlacementWithLogical;
  disabled?: boolean;
}

const SubNavBarItem = ({
  text,
  to,
  onClick,
  icon,
  iconLabel,
  backgroundColor,
  tooltipLabel,
  tooltipPlacement = "top-start",
  disabled = false,
}: Props) => {
  const { colorMode } = useColorMode();

  // Compute responsive text based on breakpoints
  const responsiveText = useBreakpointValue(
    typeof text === "string" ? { base: text } : text
  );

  return (
    <Link
      to={to}
      onClick={(event) => handleLinkClick(event, { disabled, onClick })}
    >
      <Tooltip label={tooltipLabel} placement={tooltipPlacement}>
        <HStack
          gap={0}
          backgroundColor={backgroundColor}
          borderRadius={6}
          transition="background-color 0.3s ease"
          opacity={disabled ? 0.7 : 1} // Reduce opacity when disabled
          cursor={disabled ? "not-allowed" : "pointer"} // change cursor when disabled
        >
          <IconButton
            aria-label={iconLabel}
            icon={icon}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={colorMode === "dark" ? "yellow" : "teal"}
            isDisabled={disabled} // disable the IconButton functionality
            _hover={{
              bg: useBreakpointValue({
                base: colorMode === "dark" ? "teal.900" : "gray.200",
                md: "transparent",
              }),
            }}
          />
          <Text>{responsiveText}</Text>
        </HStack>
      </Tooltip>
    </Link>
  );
};

export default SubNavBarItem;
