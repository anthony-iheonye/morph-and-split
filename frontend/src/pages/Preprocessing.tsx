import { HStack, Switch, VStack } from "@chakra-ui/react";
import { GiResize } from "react-icons/gi";
import { PiResizeFill } from "react-icons/pi";
import { RiCropFill } from "react-icons/ri";
import { TbArrowAutofitHeight, TbArrowAutofitWidth } from "react-icons/tb";
import { BoundingBox } from "../components/display";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import {
  HeightOffsetInput,
  WidthOffsetInput,
  TargetHeightInput,
  ResizeHeightInput,
  ResizeWidthInput,
} from "../components/inputFields";
import TargetWidthInput from "../components/inputFields/TargetWidthInput";
import PageTitle from "../components/PageTitle";
import { useAugConfigAndSetter } from "../hooks";

const PreProcessing = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  const handleCheckBoxChange = (key: keyof typeof augConfig) => {
    setAugConfig(key, !augConfig[key]);
  };

  return (
    <>
      <PageTitle title="Pre-Procesing" />
      {/*Crop data */}
      <BoundingBox
        transparent={true}
        padding={0}
        overflowY="auto"
        maxHeight={{ base: "70vh", md: "87vh" }}
      >
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
            <BoundingBox maxWidth={"600px"} padding={{ base: "0", md: "6" }}>
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
            <BoundingBox maxWidth={"600px"} padding={{ base: "0", md: "6" }}>
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
      </BoundingBox>
    </>
  );
};

export default PreProcessing;
