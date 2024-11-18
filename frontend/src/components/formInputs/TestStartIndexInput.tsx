import {
  FormControl,
  InputGroup,
  InputLeftAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import useAugConfigAndSetter from "../../hooks/useAugConfigAndSetter";

const TestStartIndexInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <FormControl>
      <InputGroup size="sm">
        <InputLeftAddon width="5.5rem">Testing</InputLeftAddon>
        <NumberInput
          defaultValue={1}
          min={1}
          max={1000000}
          allowMouseWheel
          value={augConfig.initialTestSaveId}
          onChange={(value) =>
            setAugConfig("initialTestSaveId", parseInt(value))
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

export default TestStartIndexInput;
