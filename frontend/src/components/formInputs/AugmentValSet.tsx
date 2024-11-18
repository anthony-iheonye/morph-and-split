import { Checkbox, FormControl } from "@chakra-ui/react";
import useAugConfigAndSetter from "../../hooks/useAugConfigAndSetter";

const AugmentValSet = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <FormControl>
      <Checkbox
        colorScheme="teal"
        isChecked={augConfig.augmentValData}
        onChange={() =>
          setAugConfig("augmentValData", !augConfig.augmentValData)
        }
      >
        Augment Validation set
      </Checkbox>
    </FormControl>
  );
};

export default AugmentValSet;
