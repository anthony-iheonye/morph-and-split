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

const ResizeDimension = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <>
      <FormControl>
        <InputGroup size="sm">
          <InputLeftAddon width="5.5rem">Height</InputLeftAddon>
          <NumberInput
            defaultValue={1}
            min={1}
            max={1000000}
            allowMouseWheel
            value={augConfig.augImageDimension?.height}
            onChange={(value) =>
              setAugConfig("augImageDimension", {
                ...augConfig.augImageDimension,
                height: parseInt(value),
                width: augConfig.augImageDimension!.width,
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
      <FormControl>
        <InputGroup size="sm">
          <InputLeftAddon width="5.5rem">Width</InputLeftAddon>
          <NumberInput
            defaultValue={1}
            min={1}
            max={1000000}
            allowMouseWheel
            value={augConfig.augImageDimension?.width}
            onChange={(value) =>
              setAugConfig("augImageDimension", {
                ...augConfig.augImageDimension,
                height: augConfig.augImageDimension!.height,
                width: parseInt(value),
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
    </>
  );
};

export default ResizeDimension;
