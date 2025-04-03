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

/**
 * Props for the SubNavBarItem component.
 */
interface Props {
  /** Text to display beside the icon. Can be a string or responsive object specifying values per breakpoint. */
  text: string | { base?: string; md?: string; lg?: string };
  /** Route path to navigate to when clicked. */
  to: To;
  /** Optional click event handler, invoked when the link is clicked. */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  /** Optional label displayed within a tooltip. */
  tooltipLabel?: string;
  /** Icon element displayed alongside text. */
  icon: React.ReactElement;
  /** Accessible label for the icon button. */
  iconLabel: string;
  /** Optional background color of the navigation item. */
  backgroundColor?: string;
  /** Placement of the tooltip relative to the navigation item. Default is 'top-start'. */
  tooltipPlacement?: PlacementWithLogical;
  /** Whether the navigation item is disabled. Disabled items are non-interactive. Default is false. */
  disabled?: boolean;
}

/**
 * SubNavBarItem component renders a navigation item composed of an icon, responsive text, and a tooltip.
 *
 * The component adjusts its styling based on theme (light/dark), screen size, and the disabled state.
 *
 * Clicking the component navigates to a specified route and optionally triggers a provided click handler.
 */
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

  /**
   * Computes responsive text based on Chakra UI's breakpoints.
   */
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
          opacity={disabled ? 0.7 : 1}
          cursor={disabled ? "not-allowed" : "pointer"}
        >
          <IconButton
            aria-label={iconLabel}
            icon={icon}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={colorMode === "dark" ? "yellow" : "teal"}
            isDisabled={disabled}
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
