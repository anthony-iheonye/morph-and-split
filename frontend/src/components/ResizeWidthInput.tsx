import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import useAugConfigAndSetter from "../hooks/useAugConfigAndSetter";
import sizes from "../services/size";

const ResizeWidthInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();
  const width = sizes.numberInput.width;

  return (
    <NumberInput
      min={1}
      max={100000}
      allowMouseWheel
      maxWidth={width}
      value={augConfig.augImageDimension?.width}
      onChange={(value) =>
        setAugConfig("augImageDimension", {
          ...augConfig.augImageDimension,
          height: augConfig.augImageDimension!.height,
          width: parseInt(value),
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

export default ResizeWidthInput;
