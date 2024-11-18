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

const HeightOffsetInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <FormControl>
      <InputGroup size="sm">
        <InputLeftAddon width="6.5rem">Height offset</InputLeftAddon>
        <NumberInput
          defaultValue={1}
          min={1}
          max={10000}
          allowMouseWheel
          value={augConfig.cropDimension?.offsetHeight}
          onChange={(value) =>
            setAugConfig("cropDimension", {
              ...augConfig.cropDimension,
              offsetHeight: parseInt(value),
              offsetWidth: augConfig.cropDimension!.offsetWidth,
              targetHeight: augConfig.cropDimension!.targetHeight,
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

export default HeightOffsetInput;
