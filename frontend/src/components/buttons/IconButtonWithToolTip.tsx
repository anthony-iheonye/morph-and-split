import {
  IconButton,
  IconButtonProps,
  PlacementWithLogical,
  Tooltip,
} from "@chakra-ui/react";

interface Props extends IconButtonProps {
  tooltipLabel: string;
  placement?: PlacementWithLogical | undefined;
  iconHoverBackgroundColor?: string;
  iconHoverColor?: string;
}

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
