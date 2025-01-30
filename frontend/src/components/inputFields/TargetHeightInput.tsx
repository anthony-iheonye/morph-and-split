import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useAugConfigAndSetter } from "../../hooks";
import { sizes } from "../../services";

const TargetHeightInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();
  const width = sizes.numberInput.width;

  return (
    <NumberInput
      maxWidth={width}
      min={1}
      max={100000}
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
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

export default TargetHeightInput;
