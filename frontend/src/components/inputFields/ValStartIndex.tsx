import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useAugConfigAndSetter } from "../../hooks";
import { sizes } from "../../services";

const ValStartIndex = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();
  const width = sizes.numberInput.width;

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
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

export default ValStartIndex;
