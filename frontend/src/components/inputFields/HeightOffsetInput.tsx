import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import {
  useAugConfigAndSetter,
  useImageMaskDimension,
  useInputThemedColor,
} from "../../hooks";
import { sizes } from "../../services";

const HeightOffsetInput = () => {
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
      min={0}
      max={imageHeight! - 10}
      allowMouseWheel
      maxWidth={width}
      value={augConfig.cropDimension?.offsetHeight}
      onChange={(value) =>
        setAugConfig("cropDimension", {
          ...augConfig.cropDimension,
          offsetHeight: isNaN(Number(value))
            ? augConfig.cropDimension!.offsetHeight
            : Number(value),
          offsetWidth: augConfig.cropDimension!.offsetWidth,
          targetHeight: augConfig.cropDimension!.targetHeight,
          targetWidth: augConfig.cropDimension!.targetWidth,
        })
      }
    >
      <NumberInputField
        bg={backgroundColor}
        border={`1px solid ${borderColor}`}
        color={textColor}
        transition="background-color 0.2s ease-in-out, border-color 0.2s ease-in-out" //Smooth transitions
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

export default HeightOffsetInput;
