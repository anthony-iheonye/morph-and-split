import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useAugConfigAndSetter, useInputThemedColor } from "../../hooks";

const TotalTrainData = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();
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
      width="auto"
      value={augConfig.totalAugmentedImages}
      onChange={(value) =>
        setAugConfig(
          "totalAugmentedImages",
          isNaN(Number(value)) ? augConfig.totalAugmentedImages : Number(value)
        )
      }
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

export default TotalTrainData;
