import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import useAugConfigAndSetter from "../hooks/useAugConfigAndSetter";

const TestStartIndex = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <NumberInput
      min={1}
      max={100000}
      allowMouseWheel
      width="auto"
      value={augConfig.initialTestSaveId}
      onChange={(value) => setAugConfig("initialTestSaveId", parseInt(value))}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

export default TestStartIndex;
