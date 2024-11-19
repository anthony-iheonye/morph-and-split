import { HStack, Text } from "@chakra-ui/react";
import { HiViewGrid } from "react-icons/hi";
import BoundingBox from "../components/BoundingBox";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import PreviewGrid from "../components/PreviewGrid";
import PreviewSwitch from "../components/PreviewSwitch";

const Preview = () => {
  return (
    <>
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
      <BoundingBox>
        <Text color={"gray.400"} mb={4} fontSize="sm">
          Preview of Selected Images and Masks.
        </Text>
        <PreviewGrid />
      </BoundingBox>
    </>
  );
};

export default Preview;
