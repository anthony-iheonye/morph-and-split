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

/**
 * TrainStartIndex is a numeric input for setting the initial save ID
 * for augmented training results.
 *
 * The input is disabled when augmentation is actively running.
 * It also includes themed styling to match light/dark modes.
 */
const TrainStartIndex = () => {
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
      value={augConfig.initialTrainSaveId}
      onChange={(valueString) => {
        const value = parseInt(valueString);
        setAugConfig(
          "initialTrainSaveId",
          isNaN(value) ? augConfig.initialTrainSaveId : value
        );
      }}
      isDisabled={augmentationIsRunning}
    >
      <NumberInputField
        bg={backgroundColor}
        border={`1px solid ${borderColor}`}
        color={textColor}
        transition="background-color 0.2s ease-in-out, border-color 0.2s ease-in-out"
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

export default TrainStartIndex;
