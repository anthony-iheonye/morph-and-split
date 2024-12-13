import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import useAugConfigStore from "../store/augConfigStore";

const SplitSelector = () => {
  const { previewedSet, setAugConfig } = useAugConfigStore((state) => ({
    previewedSet: state.augConfig.previewedSet,
    setAugConfig: state.setAugConfig,
  }));

  return (
    <RadioGroup
      onChange={(value) => setAugConfig("previewedSet", value)}
      value={previewedSet}
    >
      <Stack direction="row" spacing={6}>
        <Radio colorScheme="teal" value="train">
          Training
        </Radio>
        <Radio colorScheme="teal" value="val">
          Validation
        </Radio>
        <Radio colorScheme="teal" value="test">
          Testing
        </Radio>
      </Stack>
    </RadioGroup>
  );
};

export default SplitSelector;
