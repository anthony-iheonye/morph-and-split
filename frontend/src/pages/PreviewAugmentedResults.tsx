import { Box, HStack, Text } from "@chakra-ui/react";
import { BiSolidImageAdd } from "react-icons/bi";
import { HiViewGrid } from "react-icons/hi";
import AugmentedImageSelector from "../components/AugmentedImageSelector";
import BoundingBox from "../components/BoundingBox";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import PageTitle from "../components/PageTitle";
import PreviewAugResultSwitch from "../components/PreviewAugResultSwitch";
import PreviewAugmentedResultGrid from "../components/PreviewAugmentedResultGrid";
import AugmentedMaskSelector from "../components/AugmentedMaskSelector";

const PreviewAugmentedResults = () => {
  return (
    <>
      <PageTitle title="Preview Result" />
      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={BiSolidImageAdd}
            title="Select Augmented Images"
            description="Click button to select the augmented images."
          />
          <AugmentedImageSelector />
        </HStack>
      </BoundingBox>

      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={BiSolidImageAdd}
            title="Select Augmented Masks"
            description="Click button to select the augmented masks."
          />
          <AugmentedMaskSelector />
        </HStack>
      </BoundingBox>

      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={HiViewGrid}
            title="Preview Augmented Images and Masks"
            description="Click slider to preview selected images and their corresponding masks."
          />
          <PreviewAugResultSwitch />
        </HStack>
      </BoundingBox>
      <BoundingBox overflowY="auto">
        <Text color={"gray.400"} mb={4} fontSize="sm">
          Preview of Selected Images and Masks.
        </Text>
        <Box
          overflowY="auto"
          maxHeight={{ sm: "320px", md: "500px", lg: "700px" }}
          mt={4}
        >
          <PreviewAugmentedResultGrid />
        </Box>
      </BoundingBox>
    </>
  );
};

export default PreviewAugmentedResults;
