import { HStack, Text } from "@chakra-ui/react";
import { HiViewGrid } from "react-icons/hi";
import ContinueBtn from "../components/buttons/ContinueBtn";
import PreviousBtn from "../components/buttons/PreviousBtn";
import { BoundingBox, PreviewUploadedDataGrid } from "../components/display";
import IconHeadingDescriptionCombo from "../components/miscellaneous/IconHeadingDescriptionCombo";
import PageTitle from "../components/miscellaneous/PageTitle";
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
            description={{
              md: "Click slider to preview uploaded images and their corresponding masks.",
            }}
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

      <BoundingBox transparent padding={0}>
        <HStack justifyContent={{ base: "center", md: "start" }}>
          <PreviousBtn to="/upload_data/masks" />
          <ContinueBtn to="/settings/data_split" />
        </HStack>
      </BoundingBox>
    </>
  );
};

export default Preview;
