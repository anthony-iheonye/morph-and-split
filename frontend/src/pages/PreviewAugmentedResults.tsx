import { HStack, Text, VStack } from "@chakra-ui/react";
import { HiViewGrid } from "react-icons/hi";
import { EndSession, PreviousBtn } from "../components/buttons";
import {
  BoundingBox,
  PreviewGridTest,
  PreviewGridTrain,
  PreviewGridVal,
} from "../components/display";
import {
  IconHeadingDescriptionCombo,
  PageTitle,
  SplitSelector,
} from "../components/miscellaneous";
import { PreviewAugResultSwitch } from "../components/switches";
import { useAugConfigStore } from "../store";

const PreviewAugmentedResults = () => {
  const { previewAugmentedResult, previewedSet } = useAugConfigStore(
    (state) => ({
      previewAugmentedResult: state.previewAugmentedResult,
      previewedSet: state.augConfig.previewedSet,
    })
  );

  return (
    <>
      <PageTitle title="Preview Result" />

      <BoundingBox>
        <VStack align="start" spacing={5}>
          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={HiViewGrid}
              title={{ base: "Preview Augmented Images and Masks" }}
              description="Click slider to preview training, validation and test sets."
            />
            <PreviewAugResultSwitch />
          </HStack>
          {previewAugmentedResult ? <SplitSelector /> : null}
        </VStack>
      </BoundingBox>

      <BoundingBox overflowY="auto">
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

      <BoundingBox transparent padding={0}>
        <HStack>
          <PreviousBtn to="/augment/start_augmentation" />
          <EndSession />
        </HStack>
      </BoundingBox>
    </>
  );
};

export default PreviewAugmentedResults;
