import { HStack, SimpleGrid, Switch, Text } from "@chakra-ui/react";
import { PiFlipHorizontalFill, PiFlipVerticalFill } from "react-icons/pi";
import { RiContrastDropLine, RiCropFill } from "react-icons/ri";
import { RxRotateCounterClockwise } from "react-icons/rx";
import {
  TbBrightnessFilled,
  TbContrast2Filled,
  TbTransformFilled,
} from "react-icons/tb";
import BoundingBox from "../components/BoundingBox";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import PageTitle from "../components/PageTitle";
import useAugConfigAndSetter from "../hooks/useAugConfigAndSetter";

const AugTransformationsInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  const handleCheckBoxChange = (key: keyof typeof augConfig) => {
    setAugConfig(key, !augConfig[key]);
  };

  const transforms = {
    randomCrop:
      "Randomly selects a portion of the image to crop, resizing it to the original dimensions.",
    flipUpDown:
      "Flips the image vertically, creating a mirrored version along the horizontal axis.",
    flipLeftRight:
      "Flips the image horizontally, creating a mirrored version along the vertical axis.",
    randomRotate:
      "Rotates the image by a random angle to introduce rotation variance.",
    corruptBrightness:
      "Adjusts the brightness level randomly to simulate varying lighting conditions.",
    corruptContrast:
      "Modifies the contrast of the image to enhance or reduce color distinctions.",
    corruptSaturation:
      "Alters the intensity of colors to simulate different saturation levels.",
    augmentValData:
      "Apply the selected random transformations to the validation set.",
  };
  return (
    <>
      <PageTitle title="Transformations" />
      <BoundingBox>
        <Text color={"gray.400"} mb={4} fontSize="sm">
          Choose random transformations to apply to the training set, and
          optionally to the validation set, to enhance data variability.
        </Text>
        <SimpleGrid columns={{ base: 1 }} spacing={{ base: 5, md: 4, lg: 8 }}>
          {/*random crop*/}
          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={RiCropFill}
              title="Random Crop"
              description={transforms.randomCrop}
            />
            <Switch
              id="randomCrop"
              colorScheme="teal"
              isChecked={augConfig.randomCrop}
              onChange={() => handleCheckBoxChange("randomCrop")}
            />
          </HStack>

          {/*flip up down*/}
          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={PiFlipHorizontalFill}
              title="Flip Left-Right"
              description={transforms.flipLeftRight}
            />
            <Switch
              id="flipLeftRight"
              colorScheme="teal"
              isChecked={augConfig.flipLeftRight}
              onChange={() => handleCheckBoxChange("flipLeftRight")}
            />
          </HStack>

          {/*flip up-down*/}
          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={PiFlipVerticalFill}
              title="Flip Up-Down"
              description={transforms.flipUpDown}
            />
            <Switch
              id="flipUpDown"
              colorScheme="teal"
              isChecked={augConfig.flipUpDown}
              onChange={() => handleCheckBoxChange("flipUpDown")}
            />
          </HStack>

          {/*random rotate*/}
          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={RxRotateCounterClockwise}
              title="Random Rotate"
              description={transforms.randomRotate}
            />
            <Switch
              id="randomRotate"
              colorScheme="teal"
              isChecked={augConfig.randomRotate}
              onChange={() => handleCheckBoxChange("randomRotate")}
            />
          </HStack>

          {/*corrupt brightness*/}
          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={TbBrightnessFilled}
              title="Corrupt Brightness"
              description={transforms.corruptBrightness}
            />
            <Switch
              id="corruptBrightness"
              colorScheme="teal"
              isChecked={augConfig.corruptBrightness}
              onChange={() => handleCheckBoxChange("corruptBrightness")}
            />
          </HStack>

          {/*Corrupt contrast*/}
          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={TbContrast2Filled}
              title="Corrupt Contrast"
              description={transforms.corruptContrast}
            />
            <Switch
              id="corruptBrightness"
              colorScheme="teal"
              isChecked={augConfig.corruptContrast}
              onChange={() => handleCheckBoxChange("corruptContrast")}
            />
          </HStack>

          {/*Corrupt saturation*/}
          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={RiContrastDropLine}
              title="Corrupt Saturation"
              description={transforms.corruptSaturation}
            />
            <Switch
              id="corruptSaturation"
              colorScheme="teal"
              isChecked={augConfig.corruptSaturation}
              onChange={() => handleCheckBoxChange("corruptSaturation")}
            />
          </HStack>
        </SimpleGrid>
      </BoundingBox>

      <BoundingBox>
        {/*Corrupt saturation*/}
        <HStack justify="space-between">
          <IconHeadingDescriptionCombo
            icon={TbTransformFilled}
            title="Augment Validation Data"
            description={transforms.augmentValData}
          />
          <Switch
            id="augmentValSet"
            colorScheme="teal"
            isChecked={augConfig.augmentValData}
            onChange={() => handleCheckBoxChange("augmentValData")}
          />
        </HStack>
      </BoundingBox>
    </>
  );
};

export default AugTransformationsInput;
