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

const WidthOffsetInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();
  const width = sizes.numberInput.width;
  const {
    backgroundColor,
    borderColor,
    focusBorder,
    textColor,
    focusedBackgroundColor,
  } = useInputThemedColor();

  const { imageWidth } = useImageMaskDimension();

  return (
    <NumberInput
      min={0}
      max={imageWidth! - 10}
      allowMouseWheel
      maxWidth={width}
      value={augConfig.cropDimension?.offsetWidth}
      onChange={(value) =>
        setAugConfig("cropDimension", {
          ...augConfig.cropDimension,
          offsetHeight: augConfig.cropDimension!.offsetHeight,
          offsetWidth: isNaN(Number(value))
            ? augConfig.cropDimension!.offsetWidth
            : Number(value),
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

export default WidthOffsetInput;
