import { HStack, Text } from "@chakra-ui/react";
import { HiViewGrid } from "react-icons/hi";
import { BoundingBox, PreviewUploadedDataGrid } from "../components/display";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import PageTitle from "../components/PageTitle";
import PreviewSwitch from "../components/switches/PreviewSwitch";

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
          Preview of uploaded Images and Masks.
        </Text>
        <PreviewUploadedDataGrid />
      </BoundingBox>
    </>
  );
};

export default Preview;
