import { HStack, SimpleGrid, Text } from "@chakra-ui/react";
import { PiFlipHorizontalFill, PiFlipVerticalFill } from "react-icons/pi";
import { RiContrastDropLine, RiCropFill } from "react-icons/ri";
import { RxRotateCounterClockwise } from "react-icons/rx";
import {
  TbBrightnessFilled,
  TbContrast2Filled,
  TbTransformFilled,
} from "react-icons/tb";
import { ContinueBtn, PreviousBtn } from "../components/buttons";
import { BoundingBox } from "../components/display";
import { PageTitle } from "../components/miscellaneous";
import { RandomTransformation } from "../components/switches";

const AugTransformationsInput = () => {
  return (
    <>
      <PageTitle title="Transformations" />
      <BoundingBox>
        <Text color={"gray.400"} mb={4} fontSize="sm">
          Choose random transformations to apply to the training set, and
          optionally to the validation set, to enhance data variability.
        </Text>
        <BoundingBox
          maxHeight={{ base: "38vh", md: "70vh" }}
          overflowY={{ base: "auto", md: "hidden" }}
          padding={"0"}
          mr={0}
        >
          <SimpleGrid columns={{ base: 1 }} spacing={{ base: 5, md: 4, lg: 8 }}>
            <RandomTransformation
              header={"Random Crop"}
              transformName={"randomCrop"}
              icon={RiCropFill}
            />

            <RandomTransformation
              header={"Flip Left-Right"}
              transformName={"flipLeftRight"}
              icon={PiFlipHorizontalFill}
            />

            <RandomTransformation
              header={"Flip Up-Down"}
              transformName={"flipUpDown"}
              icon={PiFlipVerticalFill}
            />

            <RandomTransformation
              header={"Random Rotate"}
              transformName={"randomRotate"}
              icon={RxRotateCounterClockwise}
            />

            <RandomTransformation
              header={"Corrupt Brightness"}
              transformName={"corruptBrightness"}
              icon={TbBrightnessFilled}
            />

            <RandomTransformation
              header={"Corrupt Contrast"}
              transformName={"corruptContrast"}
              icon={TbContrast2Filled}
            />

            <RandomTransformation
              header={"Corrupt Saturation"}
              transformName={"corruptSaturation"}
              icon={RiContrastDropLine}
            />
          </SimpleGrid>
        </BoundingBox>
      </BoundingBox>

      <BoundingBox>
        <RandomTransformation
          header={"Augment Validation Set"}
          transformName={"augmentValData"}
          icon={TbTransformFilled}
        />
      </BoundingBox>

      <BoundingBox transparent padding={0}>
        <HStack>
          <PreviousBtn to="/settings/data_split" />
          <ContinueBtn to="/settings/visual_attributes" />
        </HStack>
      </BoundingBox>
    </>
  );
};

export default AugTransformationsInput;
