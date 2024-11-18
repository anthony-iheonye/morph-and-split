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

const ValStartIndexInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <FormControl>
      <InputGroup size="sm">
        <InputLeftAddon>Validation</InputLeftAddon>

        <NumberInput
          defaultValue={1}
          min={1}
          max={1000000}
          allowMouseWheel
          value={augConfig.initialValSaveId}
          onChange={(value) =>
            setAugConfig("initialValSaveId", parseInt(value))
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

export default ValStartIndexInput;
