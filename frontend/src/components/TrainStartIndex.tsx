import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import useAugConfigAndSetter from "../hooks/useAugConfigAndSetter";
import sizes from "../services/size";

const TrainStartIndex = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();
  const width = sizes.numberInput.width;

  return (
    <NumberInput
      min={1}
      max={100000}
      allowMouseWheel
      maxWidth={width}
      value={augConfig.initialTrainSaveId}
      onChange={(value) => setAugConfig("initialTrainSaveId", parseInt(value))}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

export default TrainStartIndex;
