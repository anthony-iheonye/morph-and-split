import { IconButton, IconButtonProps, Tooltip } from "@chakra-ui/react";

interface Props extends IconButtonProps {
  tooltipLabel: string;
  iconHoverBackgroundColor?: string;
  iconHoverColor?: string;
}

const IconButtonWithToolTip = ({
  tooltipLabel,
  "aria-label": ariaLabel,
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
    <Tooltip label={tooltipLabel}>
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
