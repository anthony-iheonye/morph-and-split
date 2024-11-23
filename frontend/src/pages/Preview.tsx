import { Box, HStack, Text } from "@chakra-ui/react";
import { HiViewGrid } from "react-icons/hi";
import BoundingBox from "../components/BoundingBox";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import PreviewGrid from "../components/PreviewGrid";
import PreviewSwitch from "../components/PreviewSwitch";
import PageTitle from "../components/PageTitle";

const Preview = () => {
  return (
    <>
      <PageTitle title="Preview" />
      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={HiViewGrid}
            title="Preview Images and Masks"
            description="Click slider to preview selected images and their corresponding masks."
          />
          <PreviewSwitch />
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
          <PreviewGrid />
        </Box>
      </BoundingBox>
    </>
  );
};

export default Preview;
