import {
  Box,
  IconButton,
  PlacementWithLogical,
  Tooltip,
} from "@chakra-ui/react";
import { Link, To } from "react-router-dom";
import { useNavIconColor } from "../../../hooks";

/**
 * MainNavBarItem component represents a navigation item in the main navbar,
 * consisting of an icon button that links to a specified route.
 * It also supports optional tooltips and dynamic disabling of the button.
 *
 * The button can be disabled by passing the `disabled` prop, which will prevent
 * the user from interacting with it.
 *
 * Props:
 * - `to`: The target route to navigate when the button is clicked.
 * - `tooltipLabel`: Optional tooltip that appears when hovering over the button.
 * - `icon`: The icon to be displayed on the button.
 * - `iconLabel`: The label for the icon used for accessibility (aria-label).
 * - `backgroundColor`: Optional background color for the button.
 * - `tooltipPlacement`: Optional placement of the tooltip (defaults to "top-start").
 * - `disabled`: Optional flag to disable the button (defaults to `false`).
 *
 * @returns {JSX.Element} The navigation item for the main navbar with an icon and optional tooltip.
 */
interface Props {
  to: To;
  tooltipLabel?: string;
  icon: React.ReactElement;
  iconLabel: string;
  backgroundColor?: string;
  tooltipPlacement?: PlacementWithLogical;
  disabled?: boolean;
}

const MainNavBarItem = ({
  to,
  icon,
  iconLabel,
  backgroundColor,
  tooltipLabel,
  tooltipPlacement = "top-start",
  disabled = false,
}: Props) => {
  const colorScheme = useNavIconColor();
  return (
    <Box width="auto" alignSelf="center">
      <Link to={to}>
        <Tooltip label={tooltipLabel} placement={tooltipPlacement}>
          <IconButton
            aria-label={iconLabel}
            icon={icon}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={colorScheme}
            backgroundColor={backgroundColor}
            disabled={disabled}
          />
        </Tooltip>
      </Link>
    </Box>
  );
};

export default MainNavBarItem;
