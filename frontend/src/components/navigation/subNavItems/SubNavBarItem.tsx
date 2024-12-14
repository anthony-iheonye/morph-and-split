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

interface Props {
  text: string | { base: string; md?: string; lg?: string }; // Support both plain strings and responsive objects
  to: To;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  tooltipLabel?: string;
  icon: React.ReactElement;
  iconLabel: string;
  backgroundColor?: string;
  tooltipPlacement?: PlacementWithLogical;
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
}: Props) => {
  const { colorMode } = useColorMode();

  // Compute responsive text based on breakpoints
  const responsiveText = useBreakpointValue(
    typeof text === "string" ? { base: text } : text
  );

  return (
    <Link to={to} onClick={onClick}>
      <Tooltip label={tooltipLabel} placement={tooltipPlacement}>
        <HStack
          gap={0}
          backgroundColor={backgroundColor}
          borderRadius={4}
          transition="background-color 0.3s ease"
        >
          <IconButton
            aria-label={iconLabel}
            icon={icon}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={colorMode === "dark" ? "yellow" : "teal"}
          />
          <Text>{responsiveText}</Text>
        </HStack>
      </Tooltip>
    </Link>
  );
};

export default SubNavBarItem;
