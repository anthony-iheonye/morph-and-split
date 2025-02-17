import { Grid, GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import { HiViewGrid } from "react-icons/hi";
import { EndSession, PreviousBtn } from "../components/buttons";
import {
  BoundingBox,
  PreviewGridTest,
  PreviewGridTrain,
  PreviewGridVal,
} from "../components/display";
import {
  IconComboControl,
  PageTitle,
  SplitSelector,
} from "../components/miscellaneous";
import { PreviewAugResultSwitch } from "../components/switches";
import { useBackendResponse } from "../hooks";
import { useAugConfigStore } from "../store";

const PreviewAugmentedResults = () => {
  const { previewAugmentedResult, previewedSet } = useAugConfigStore(
    (state) => ({
      previewAugmentedResult: state.previewAugmentedResult,
      previewedSet: state.augConfig.previewedSet,
    })
  );
  const { isShuttingDown } = useBackendResponse();

  return (
    <Grid
      templateAreas={{
        base: `"title"
               "previewSlider"
               "previewGrid"
               "navBtn"`,
      }}
      templateColumns={{ base: "1fr" }}
      templateRows={{ base: "auto 1fr auto" }}
      overflow="hidden"
      maxHeight="100%"
    >
      <GridItem area="title">
        <PageTitle title="Preview Result" />
      </GridItem>

      <GridItem area="previewSlider">
        <BoundingBox>
          <VStack align="start" spacing={2.5}>
            <IconComboControl
              icon={HiViewGrid}
              title={{
                base: "Preview Augmented Data",
                md: "Preview Augmented Images and Masks",
              }}
              description={{
                md: "Click slider to preview training, validation and test sets.",
              }}
              titleFontSize={16}
              controlElement={<PreviewAugResultSwitch />}
            />

            {previewAugmentedResult ? <SplitSelector /> : null}
          </VStack>
        </BoundingBox>
      </GridItem>

      <GridItem
        area="previewGrid"
        display="flex"
        flexDirection="column"
        flex="1"
        overflowY="hidden"
      >
        <BoundingBox
          display="flex"
          flexDirection="column"
          flex="1"
          overflowY="hidden"
          mt={0}
        >
          <Text color={"gray.400"} mb={4} fontSize="sm">
            Preview of augmented result.
          </Text>
          {previewedSet === "train" ? (
            <PreviewGridTrain />
          ) : previewedSet === "val" ? (
            <PreviewGridVal />
          ) : (
            <PreviewGridTest />
          )}
        </BoundingBox>
      </GridItem>

      <GridItem area="navBtn">
        <BoundingBox transparent padding={0} mt={0}>
          <HStack justifyContent={{ base: "center", md: "start" }}>
            <PreviousBtn
              to="/augment/start_augmentation"
              disable={isShuttingDown}
            />
            <EndSession size={"sm"} />
          </HStack>
        </BoundingBox>
      </GridItem>
    </Grid>
  );
};

export default PreviewAugmentedResults;
