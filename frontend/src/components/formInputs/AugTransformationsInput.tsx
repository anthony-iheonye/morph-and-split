import { Checkbox, FormControl, FormLabel, SimpleGrid } from "@chakra-ui/react";
import useAugConfigAndSetter from "../../hooks/useAugConfigAndSetter";

const AugTransformationsInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  const handleCheckBoxChange = (key: keyof typeof augConfig) => {
    setAugConfig(key, !augConfig[key]);
  };
  return (
    <FormControl>
      <FormLabel fontSize="lg" fontWeight={700}>
        Select Transformations
      </FormLabel>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }}>
        <Checkbox
          colorScheme="teal"
          isChecked={augConfig.randomCrop}
          onChange={() => handleCheckBoxChange("randomCrop")}
        >
          Random crop
        </Checkbox>
        <Checkbox
          colorScheme="teal"
          isChecked={augConfig.flipLeftRight}
          onChange={() => handleCheckBoxChange("flipLeftRight")}
        >
          Flip left-right
        </Checkbox>
        <Checkbox
          colorScheme="teal"
          isChecked={augConfig.flipUpDown}
          onChange={() => handleCheckBoxChange("flipUpDown")}
        >
          Flip up-down
        </Checkbox>
        <Checkbox
          colorScheme="teal"
          isChecked={augConfig.randomRotate}
          onChange={() => handleCheckBoxChange("randomRotate")}
        >
          Random rotate
        </Checkbox>
        <Checkbox
          colorScheme="teal"
          isChecked={augConfig.corruptBrightness}
          onChange={() => handleCheckBoxChange("corruptBrightness")}
        >
          Corrupt brightness
        </Checkbox>
        <Checkbox
          colorScheme="teal"
          isChecked={augConfig.corruptContrast}
          onChange={() => handleCheckBoxChange("corruptContrast")}
        >
          Corrupt contrast
        </Checkbox>
        <Checkbox
          colorScheme="teal"
          isChecked={augConfig.corruptSaturation}
          onChange={() => handleCheckBoxChange("corruptSaturation")}
        >
          Corrupt saturation
        </Checkbox>
        <Checkbox
          colorScheme="teal"
          //   isChecked={false}
          onChange={() => console.log(augConfig)}
        >
          show state
        </Checkbox>
      </SimpleGrid>
    </FormControl>
  );
};

export default AugTransformationsInput;
