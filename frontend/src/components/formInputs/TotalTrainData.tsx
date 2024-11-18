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

const TotalTrainData = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <FormControl>
      <FormLabel> Total training image after augmentation </FormLabel>
      <InputGroup size="sm">
        <InputLeftAddon width="5.5rem">Size</InputLeftAddon>
        <NumberInput
          defaultValue={1}
          min={1}
          max={1000000}
          allowMouseWheel
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
      </InputGroup>
    </FormControl>
  );
};

export default TotalTrainData;
