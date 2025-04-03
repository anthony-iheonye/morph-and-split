import {
  IconButton,
  IconButtonProps,
  PlacementWithLogical,
  Tooltip,
} from "@chakra-ui/react";

/**
 * Props for the IconButtonWithToolTip component.
 * Extends Chakra UI's IconButtonProps to include tooltip configuration and custom hover styling.
 */
interface Props extends IconButtonProps {
  /** Label displayed in the tooltip. */
  tooltipLabel: string;
  /** Optional placement of the tooltip relative to the button. */
  placement?: PlacementWithLogical | undefined;
  /** Optional background color applied to the icon on hover. */
  iconHoverBackgroundColor?: string;
  /** Optional text/icon color applied on hover. */
  iconHoverColor?: string;
}

/**
 * IconButtonWithToolTip is a wrapper around Chakra UI's IconButton with an added tooltip.
 *
 * This component supports optional hover styles for background and icon color,
 * and ensures accessibility via the required `aria-label`.
 */
const IconButtonWithToolTip = ({
  tooltipLabel,
  "aria-label": ariaLabel,
  placement,
  colorScheme = "red",
  iconHoverBackgroundColor = "transparent",
  iconHoverColor = "red.400",
  variant = "ghost",
  isDisabled,
  icon,
  size,
  onClick,
  ...rest // Excludes ariaLabel
}: Props) => {
  return (
    <Tooltip label={tooltipLabel} placement={placement}>
      <IconButton
        height="auto"
        minWidth={2}
        aria-label={ariaLabel} // Explicitly passed
        icon={icon}
        variant={variant}
        size={size}
        fontSize="1.5rem"
        colorScheme={colorScheme}
        isDisabled={isDisabled}
        onClick={onClick}
        _hover={{
          bg: iconHoverBackgroundColor,
          color: iconHoverColor,
        }}
        borderRadius={24}
        {...rest} // Remaining props without ariaLabel
      />
    </Tooltip>
  );
};

export default IconButtonWithToolTip;
