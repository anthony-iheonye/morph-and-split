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

const TargetHeightInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <FormControl>
      <InputGroup size="sm">
        <InputLeftAddon width="6.5rem">Target Height</InputLeftAddon>
        <NumberInput
          defaultValue={1}
          min={1}
          max={10000}
          allowMouseWheel
          value={augConfig.cropDimension?.targetHeight}
          onChange={(value) =>
            setAugConfig("cropDimension", {
              ...augConfig.cropDimension,
              offsetHeight: augConfig.cropDimension!.offsetHeight,
              offsetWidth: augConfig.cropDimension!.offsetWidth,
              targetHeight: parseInt(value),
              targetWidth: augConfig.cropDimension!.targetWidth,
            })
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

export default TargetHeightInput;
