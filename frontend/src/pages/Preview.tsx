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
            title="Preview Upload"
            description="Click slider to preview uploaded images and their corresponding masks."
          />
          <PreviewSwitch />
        </HStack>
      </BoundingBox>

      <BoundingBox>
        <Text color={"gray.400"} mb={4} fontSize="sm">
          Preview of Selected Images and Masks.
        </Text>
        <Box
          overflowY="auto"
          maxHeight={{ sm: "400px", md: "550px", lg: "650px" }}
          // height="100%"
          mt={4}
          flex="1"
        >
          <PreviewUploadedDataGrid />
        </Box>
      </BoundingBox>
    </>
  );
};

export default Preview;
