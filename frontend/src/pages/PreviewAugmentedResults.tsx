import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { HiViewGrid } from "react-icons/hi";
import BoundingBox from "../components/BoundingBox";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import PageTitle from "../components/PageTitle";
import PreviewAugResultSwitch from "../components/PreviewAugResultSwitch";
import PreviewGridTest from "../components/PreviewGridTest";
import PreviewGridTrain from "../components/PreviewGridTrain";
import PreviewGridVal from "../components/PreviewGridVal";
import SplitSelector from "../components/SplitSelector";
import useAugConfigStore from "../store/augConfigStore";

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
              title="Preview Augmented Images and Masks"
              description="Click slider to preview training, validation and test sets."
            />
            <PreviewAugResultSwitch />
          </HStack>
          {previewAugmentedResult ? <SplitSelector /> : null}
        </VStack>
      </BoundingBox>

      <BoundingBox overflowY="auto">
        <Text color={"gray.400"} mb={4} fontSize="sm">
          Preview of Selected Images and Masks.
        </Text>
        <Box
          overflowY="auto"
          maxHeight={{ sm: "320px", md: "500px", lg: "620px" }}
          mt={4}
        >
          {previewedSet === "train" ? (
            <PreviewGridTrain />
          ) : previewedSet === "val" ? (
            <PreviewGridVal />
          ) : (
            <PreviewGridTest />
          )}
        </Box>
      </BoundingBox>
    </>
  );
};

export default PreviewAugmentedResults;
