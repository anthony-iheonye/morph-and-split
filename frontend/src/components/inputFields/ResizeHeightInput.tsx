import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useAugConfigAndSetter } from "../../hooks";
import { sizes } from "../../services";

const ResizeHeightInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();
  const width = sizes.numberInput.width;

  return (
    <NumberInput
      min={1}
      max={100000}
      allowMouseWheel
      maxWidth={width}
      value={augConfig.augImageDimension?.height}
      onChange={(value) =>
        setAugConfig("augImageDimension", {
          ...augConfig.augImageDimension,
          height: parseInt(value),
          width: augConfig.augImageDimension!.width,
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

export default ResizeHeightInput;
