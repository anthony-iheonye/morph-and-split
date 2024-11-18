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

const TargetWidthInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <FormControl>
      <InputGroup size="sm">
        <InputLeftAddon width="6.5rem">Target Width</InputLeftAddon>
        <NumberInput
          defaultValue={1}
          min={1}
          max={10000}
          allowMouseWheel
          value={augConfig.cropDimension?.targetWidth}
          onChange={(value) =>
            setAugConfig("cropDimension", {
              ...augConfig.cropDimension,
              offsetHeight: augConfig.cropDimension!.offsetHeight,
              offsetWidth: augConfig.cropDimension!.offsetWidth,
              targetHeight: augConfig.cropDimension!.targetHeight,
              targetWidth: parseInt(value),
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

export default TargetWidthInput;
