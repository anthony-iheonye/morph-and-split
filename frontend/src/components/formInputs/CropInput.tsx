import { Checkbox, FormControl, FormLabel } from "@chakra-ui/react";
import useAugConfigAndSetter from "../../hooks/useAugConfigAndSetter";

const CropInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <FormControl>
      <FormLabel fontSize="lg" fontWeight={700}>
        Crop Data{" "}
      </FormLabel>
      <Checkbox
        colorScheme="teal"
        isChecked={augConfig.crop}
        onChange={() => setAugConfig("crop", !augConfig.crop)}
      >
        Crop original data
      </Checkbox>
    </FormControl>
  );
};

export default CropInput;
