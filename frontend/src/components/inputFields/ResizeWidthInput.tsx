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
 * ResizeWidthInput is a numeric input field for setting the width
 * of augmented images within the augmentation configuration.
 *
 * It allows mouse wheel interactions and restricts input between 1 and 4000 pixels.
 * Themed colors adjust the input styling to match light or dark mode.
 */
const ResizeWidthInput = () => {
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
      min={1}
      max={4000}
      allowMouseWheel
      maxWidth={width}
      value={augConfig.augImageDimension?.width}
      onChange={(value) =>
        setAugConfig("augImageDimension", {
          ...augConfig.augImageDimension,
          height: augConfig.augImageDimension!.height,
          width: isNaN(Number(value))
            ? augConfig.augImageDimension!.width
            : Number(value),
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

export default ResizeWidthInput;
