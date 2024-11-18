import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import useAugConfigAndSetter from "../../hooks/useAugConfigAndSetter";

const TrainStartIndexInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <FormControl>
      <FormLabel> Taining data start index </FormLabel>
      <InputGroup size="sm">
        <InputLeftAddon width="5.5rem">Training</InputLeftAddon>
        <NumberInput
          defaultValue={1}
          min={1}
          max={1000000}
          allowMouseWheel
          value={augConfig.initialTrainSaveId}
          onChange={(value) =>
            setAugConfig("initialTrainSaveId", parseInt(value))
          }
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>
    </FormControl>
  );
};

export default TrainStartIndexInput;
