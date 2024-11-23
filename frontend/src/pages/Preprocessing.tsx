import { HStack, Switch, VStack } from "@chakra-ui/react";
import { GiResize } from "react-icons/gi";
import { PiResizeFill } from "react-icons/pi";
import { RiCropFill } from "react-icons/ri";
import { TbArrowAutofitHeight, TbArrowAutofitWidth } from "react-icons/tb";
import BoundingBox from "../components/BoundingBox";
import HeightOffsetInput from "../components/formInputs/HeightOffsetInput";
import TargetHeightInput from "../components/formInputs/TargetHeightInput";
import TargetWidthInput from "../components/formInputs/TargetWidthInput";
import WidthOffsetInput from "../components/formInputs/WidthOffsetInput";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import ResizeHeightInput from "../components/ResizeHeightInput";
import ResizeWidthInput from "../components/ResizeWidthInput";
import useAugConfigAndSetter from "../hooks/useAugConfigAndSetter";
import PageTitle from "../components/PageTitle";

const PreProcessing = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  const handleCheckBoxChange = (key: keyof typeof augConfig) => {
    setAugConfig(key, !augConfig[key]);
  };

  return (
    <>
      <PageTitle title="Pre-Procesing" />
      {/*Crop data */}
      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={RiCropFill}
            title="Crop Original Data"
            description="Crop the original image and mask to a specified size before applying augmentation"
          />
          <Switch
            id="crop"
            colorScheme="teal"
            isChecked={augConfig.crop}
            onChange={() => handleCheckBoxChange("crop")}
          />
        </HStack>
        {augConfig.crop ? (
          <BoundingBox maxWidth={"600"}>
            <VStack spacing={{ base: 5, md: 4, lg: 8 }}>
              <HStack justify="space-between" align="start" width="100%">
                <IconHeadingDescriptionCombo
                  icon={PiResizeFill}
                  title="Height Offset"
                  description="Adjusts the vertical position of the cropping area within the image."
                />
                <HeightOffsetInput />
              </HStack>
              <HStack justify="space-between" align="start" width="100%">
                <IconHeadingDescriptionCombo
                  icon={PiResizeFill}
                  title="Width Offset"
                  description="Adjusts the horizontal position of the cropping area within the image."
                />
                <WidthOffsetInput />
              </HStack>
              <HStack justify="space-between" align="start" width="100%">
                <IconHeadingDescriptionCombo
                  icon={TbArrowAutofitHeight}
                  title="Target Height"
                  description="The height of the image/mask after cropping."
                />
                <TargetHeightInput />
              </HStack>
              <HStack justify="space-between" align="start" width="100%">
                <IconHeadingDescriptionCombo
                  icon={TbArrowAutofitWidth}
                  title="Target Width"
                  description="The width of the image/mask after cropping."
                />
                <TargetWidthInput />
              </HStack>
            </VStack>
          </BoundingBox>
        ) : null}
      </BoundingBox>

      {/*Resize Data*/}
      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={GiResize}
            title="Resize Data"
            description="Resize images and masks to specified dimensions before augmentation. If cropping is selected, the images and masks will be cropped first, then resized."
          />
          <Switch
            id="crop"
            colorScheme="teal"
            isChecked={augConfig.resizeAugImage}
            onChange={() => handleCheckBoxChange("resizeAugImage")}
          />
        </HStack>
        {augConfig.resizeAugImage ? (
          <BoundingBox maxWidth={"600"}>
            <VStack spacing={{ base: 5, md: 4, lg: 8 }}>
              <HStack justify="space-between" align="start" width="100%">
                <IconHeadingDescriptionCombo
                  icon={TbArrowAutofitHeight}
                  title="Image Height"
                  description="The height of the image/mask after resizing."
                />
                <ResizeHeightInput />
              </HStack>
              <HStack justify="space-between" align="start" width="100%">
                <IconHeadingDescriptionCombo
                  icon={TbArrowAutofitWidth}
                  title="Image Width"
                  description="The width of the image/mask after resizing."
                />
                <ResizeWidthInput />
              </HStack>
            </VStack>
          </BoundingBox>
        ) : null}
      </BoundingBox>
    </>
  );
};

export default PreProcessing;
