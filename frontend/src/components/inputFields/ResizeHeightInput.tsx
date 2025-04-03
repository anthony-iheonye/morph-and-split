import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useAugConfigAndSetter, useInputThemedColor } from "../../hooks";
import { sizes } from "../../services";

/**
 * ResizeHeightInput is a numeric input field for configuring the height
 * of augmented images in the augmentation settings.
 *
 * It supports mouse wheel adjustments and restricts input between 10 and 4000 pixels.
 * Visual styles are adapted to the current theme for a consistent look.
 */
const ResizeHeightInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();
  const width = sizes.numberInput.width;
  const {
    backgroundColor,
    borderColor,
    focusBorder,
    textColor,
    focusedBackgroundColor,
  } = useInputThemedColor();

  return (
    <NumberInput
      min={10}
      max={4000}
      allowMouseWheel
      maxWidth={width}
      value={augConfig.augImageDimension?.height}
      onChange={(value) =>
        setAugConfig("augImageDimension", {
          ...augConfig.augImageDimension,
          height: isNaN(Number(value))
            ? augConfig.augImageDimension!.height
            : Number(value),
          width: augConfig.augImageDimension!.width,
        })
      }
    >
      <NumberInputField
        bg={backgroundColor}
        border={`1px solid ${borderColor}`}
        color={textColor}
        transition="background-color 0.2s ease-in-out, border-color 0.2s ease-in-out"
        _focus={{
          border: `2px solid ${focusBorder}`,
          boxShadow: `0 0 0 2px ${focusBorder}`,
          bg: focusedBackgroundColor,
        }}
      />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

export default ResizeHeightInput;
