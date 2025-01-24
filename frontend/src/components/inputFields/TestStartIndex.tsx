import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useAugConfigAndSetter, useBackendResponse } from "../../hooks";
import { sizes } from "../../services";

const TestStartIndex = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();
  const width = sizes.numberInput.width;
  const { augmentationIsRunning } = useBackendResponse();

  return (
    <NumberInput
      min={1}
      max={100000}
      allowMouseWheel
      maxWidth={width}
      value={augConfig.initialTestSaveId}
      onChange={(valueString) => {
        const value = parseInt(valueString);
        setAugConfig(
          "initialTestSaveId",
          isNaN(value) ? augConfig.initialTestSaveId : value
        );
      }}
      isDisabled={augmentationIsRunning}
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
