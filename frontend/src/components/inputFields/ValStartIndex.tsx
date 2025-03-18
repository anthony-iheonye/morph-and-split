import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import {
  useAugConfigAndSetter,
  useBackendResponse,
  useInputThemedColor,
} from "../../hooks";
import { sizes } from "../../services";

const ValStartIndex = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();
  const width = sizes.numberInput.width;
  const { augmentationIsRunning } = useBackendResponse();
  const {
    backgroundColor,
    borderColor,
    focusBorder,
    textColor,
    focusedBackgroundColor,
  } = useInputThemedColor();

  return (
    <NumberInput
      min={1}
      max={100000}
      allowMouseWheel
      maxWidth={width}
      value={augConfig.initialValSaveId}
      onChange={(valueString) => {
        const value = parseInt(valueString);
        setAugConfig(
          "initialValSaveId",
          isNaN(value) ? augConfig.initialValSaveId : value
        );
      }}
      isDisabled={augmentationIsRunning}
    >
      <NumberInputField
        bg={backgroundColor}
        border={`1px solid ${borderColor}`}
        color={textColor}
        transition="background-color 0.2s ease-in-out, border-color 0.2s ease-in-out" //Smooth transitions
        _focus={{
          border: `2px solid ${focusBorder}`,
          boxShadow: `0 0 0 2px ${focusBorder}`,
          bg: focusedBackgroundColor,
        }}
      />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

export default ValStartIndex;
