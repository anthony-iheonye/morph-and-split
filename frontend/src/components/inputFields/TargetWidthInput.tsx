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
 * TargetWidthInput is a numeric input component used for setting the target width
 * of a cropped image section in augmentation configuration.
 *
 * The maximum value is constrained by the image's width minus the offset width.
 * Input styling dynamically adjusts to light/dark mode themes.
 */
const TargetWidthInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();
  const width = sizes.numberInput.width;
  const {
    backgroundColor,
    borderColor,
    focusBorder,
    textColor,
    focusedBackgroundColor,
  } = useInputThemedColor();

  // width of the uploaded image
  const { imageWidth } = useImageMaskDimension();

  return (
    <NumberInput
      min={1}
      max={imageWidth! - augConfig.cropDimension?.offsetWidth!}
      allowMouseWheel
      maxWidth={width}
      value={augConfig.cropDimension?.targetWidth}
      onChange={(value) =>
        setAugConfig("cropDimension", {
          ...augConfig.cropDimension,
          offsetHeight: augConfig.cropDimension!.offsetHeight,
          offsetWidth: augConfig.cropDimension!.offsetWidth,
          targetHeight: augConfig.cropDimension!.targetHeight,
          targetWidth: isNaN(Number(value))
            ? augConfig.cropDimension!.targetWidth
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

export default TargetWidthInput;
