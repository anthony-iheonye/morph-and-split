import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import useAugConfigAndSetter from "../hooks/useAugConfigAndSetter";

const TotalTrainData = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <NumberInput
      min={1}
      max={100000}
      allowMouseWheel
      width="auto"
      value={augConfig.totalAugmentedImages}
      onChange={(value) =>
        setAugConfig("totalAugmentedImages", parseInt(value))
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

export default TotalTrainData;
