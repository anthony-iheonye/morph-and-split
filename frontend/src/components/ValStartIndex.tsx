import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import useAugConfigAndSetter from "../hooks/useAugConfigAndSetter";

const ValStartIndex = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <NumberInput
      min={1}
      max={100000}
      allowMouseWheel
      width="auto"
      value={augConfig.initialValSaveId}
      onChange={(value) => setAugConfig("initialValSaveId", parseInt(value))}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

export default ValStartIndex;
