import { HStack, Text } from "@chakra-ui/react";
import { HiViewGrid } from "react-icons/hi";
import { BoundingBox, PreviewUploadedDataGrid } from "../components/display";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import PageTitle from "../components/PageTitle";
import PreviewSwitch from "../components/switches/PreviewSwitch";
import ContinueBtn from "../components/buttons/ContinueBtn";
import PreviousBtn from "../components/buttons/PreviousBtn";
import { useNavigate } from "react-router-dom";

const Preview = () => {
  const navigate = useNavigate();

  const handlePrevious = () => {
    navigate("/upload_data/masks");
  };

  const handleContinue = () => {
    navigate("/settings");
  };

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
        <HStack>
          <PreviousBtn label="Previous" setPrevious={handlePrevious} />
          <ContinueBtn label="Continue" setContinue={handleContinue} />
        </HStack>
      </BoundingBox>
    </>
  );
};

export default Preview;
