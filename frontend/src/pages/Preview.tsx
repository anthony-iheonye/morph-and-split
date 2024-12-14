import { Box, HStack, Text } from "@chakra-ui/react";
import { HiViewGrid } from "react-icons/hi";
import BoundingBox from "../components/BoundingBox";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import PreviewUploadedDataGrid from "../components/display/PreviewUploadedDataGrid";
import PreviewSwitch from "../components/switches/PreviewSwitch";
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
          maxHeight={{ sm: "320px", md: "550px", lg: "650px" }}
          mt={4}
        >
          <PreviewUploadedDataGrid />
        </Box>
      </BoundingBox>
    </>
  );
};

export default Preview;
