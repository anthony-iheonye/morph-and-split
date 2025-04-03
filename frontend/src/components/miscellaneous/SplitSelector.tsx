import { Radio, RadioGroup, Stack, useBreakpointValue } from "@chakra-ui/react";
import { AugConfigStore, useAugConfigStore } from "../../store";

/**
 * SplitSelector renders a responsive radio group that allows users to
 * toggle between previewing training, validation, or testing image sets.
 *
 * The displayed labels adapt to the screen size using Chakra's breakpoint system.
 * The selected value updates the `previewedSet` value in the augmentation config store.
 */
const SplitSelector = () => {
  const { previewedSet, setAugConfig } = useAugConfigStore(
    (state: AugConfigStore) => ({
      previewedSet: state.augConfig.previewedSet,
      setAugConfig: state.setAugConfig,
    })
  );

  const trainText = useBreakpointValue({ base: "Train", md: "Training" });
  const valText = useBreakpointValue({ base: "Val", md: "Validation" });
  const testText = useBreakpointValue({ base: "Test", md: "Testing" });

  return (
    <RadioGroup
      onChange={(value) => setAugConfig("previewedSet", value)}
      value={previewedSet}
    >
      <Stack direction="row" spacing={6} ml={1}>
        <Radio colorScheme="teal" value="train">
          {trainText}
        </Radio>
        <Radio colorScheme="teal" value="val">
          {valText}
        </Radio>
        <Radio colorScheme="teal" value="test">
          {testText}
        </Radio>
      </Stack>
    </RadioGroup>
  );
};

export default SplitSelector;
