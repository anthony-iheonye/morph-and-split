import { Grid, GridItem, HStack, SimpleGrid, Text } from "@chakra-ui/react";
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
    <Grid
      templateAreas={{
        base: `"title"
             "transformations"
             "augmentOtherSets"
             "navBtn"`,
      }}
      templateColumns={{ base: "1fr" }}
      templateRows={{ base: "auto 1fr auto auto" }}
      overflow="hidden"
      maxHeight="100%"
    >
      <GridItem area="title">
        <PageTitle title="Transformations" />
      </GridItem>

      <GridItem
        area="transformations"
        display="flex"
        flexDirection="column"
        overflowY="hidden"
        // flex="1"
      >
        <BoundingBox
          display="flex"
          flexDirection="column"
          overflowY="hidden"
          // flex="1"
        >
          <Text
            color={"gray.400"}
            mb={4}
            fontSize="sm"
            pb={3}
            boxShadow={{
              base: "0px 4px 4px -4px rgb(73, 69, 69)",
              lg: "none",
            }}
          >
            Choose random transformations for augmenting the training set.
          </Text>
          <BoundingBox
            padding={"0"}
            paddingRight={3}
            mr={0}
            ml={2}
            mt={0}
            // flex="1"
            overflow="auto"
          >
            <SimpleGrid
              columns={{ base: 1 }}
              spacing={{ base: 5, md: 4, lg: 8 }}
            >
              <RandomTransformation
                title={"Random Crop"}
                transformName={"randomCrop"}
                icon={RiCropFill}
              />

              <RandomTransformation
                title={"Flip Left-Right"}
                transformName={"flipLeftRight"}
                icon={PiFlipHorizontalFill}
              />

              <RandomTransformation
                title={"Flip Up-Down"}
                transformName={"flipUpDown"}
                icon={PiFlipVerticalFill}
              />

              <RandomTransformation
                title={"Random Rotate"}
                transformName={"randomRotate"}
                icon={RxRotateCounterClockwise}
              />

              <RandomTransformation
                title={"Corrupt Brightness"}
                transformName={"corruptBrightness"}
                icon={TbBrightnessFilled}
              />

              <RandomTransformation
                title={"Corrupt Contrast"}
                transformName={"corruptContrast"}
                icon={TbContrast2Filled}
              />

              <RandomTransformation
                title={"Corrupt Saturation"}
                transformName={"corruptSaturation"}
                icon={RiContrastDropLine}
              />
            </SimpleGrid>
          </BoundingBox>
        </BoundingBox>
      </GridItem>

      <GridItem area="augmentOtherSets">
        <BoundingBox mt={0} paddingRight={{ base: 7, md: 9 }}>
          <RandomTransformation
            title={{
              base: "Augment Validation & Test Sets",
              md: "Augment Validation and Test Sets",
            }}
            transformName={"augmentValData"}
            icon={TbTransformFilled}
          />
        </BoundingBox>
      </GridItem>

      <GridItem area="navBtn">
        <BoundingBox transparent padding={0} mt={0}>
          <HStack justifyContent={{ base: "center", md: "start" }}>
            <PreviousBtn to="/settings/data_split" />
            <ContinueBtn to="/settings/visual_attributes" />
          </HStack>
        </BoundingBox>
      </GridItem>
    </Grid>
  );
};

export default AugTransformationsInput;
