import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import {
  useAugConfigAndSetter,
  useImageMaskDimension,
  useInputThemedColor,
} from "../../hooks";
import { sizes } from "../../services";

/**
 * TargetHeightInput is a numeric input field for setting the target height
 * for cropping operations during augmentation.
 *
 * The maximum value is dynamically determined by subtracting the offset height
 * from the image height to prevent out-of-bound cropping.
 * It includes theme-aware styling for consistent UI behavior.
 */
const TargetHeightInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();
  const width = sizes.numberInput.width;
  const {
    backgroundColor,
    borderColor,
    focusBorder,
    textColor,
    focusedBackgroundColor,
  } = useInputThemedColor();

  const { imageHeight } = useImageMaskDimension();

  return (
    <NumberInput
      maxWidth={width}
      min={1}
      max={imageHeight! - augConfig.cropDimension?.offsetHeight!}
      allowMouseWheel
      value={augConfig.cropDimension?.targetHeight}
      onChange={(value) =>
        setAugConfig("cropDimension", {
          ...augConfig.cropDimension,
          offsetHeight: augConfig.cropDimension!.offsetHeight,
          offsetWidth: augConfig.cropDimension!.offsetWidth,
          targetHeight: isNaN(Number(value))
            ? augConfig.cropDimension!.targetHeight
            : Number(value),
          targetWidth: augConfig.cropDimension!.targetWidth,
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

export default TargetHeightInput;
