import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import useAugConfigAndSetter from "../hooks/useAugConfigAndSetter";
import sizes from "../services/size";

const HeightOffsetInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();
  const width = sizes.numberInput.width;

  return (
    <NumberInput
      min={1}
      max={100000}
      allowMouseWheel
      maxWidth={width}
      value={augConfig.cropDimension?.offsetHeight}
      onChange={(value) =>
        setAugConfig("cropDimension", {
          ...augConfig.cropDimension,
          offsetHeight: parseInt(value),
          offsetWidth: augConfig.cropDimension!.offsetWidth,
          targetHeight: augConfig.cropDimension!.targetHeight,
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

export default HeightOffsetInput;
