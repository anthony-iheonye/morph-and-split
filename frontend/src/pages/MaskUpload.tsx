import { HStack, Box, Text } from "@chakra-ui/react";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoLayers } from "react-icons/io5";
import { TbLayersSelected } from "react-icons/tb";
import MaskUploader from "../components/buttons/MaskUploader";
import { BoundingBox } from "../components/display";
import { MaskChannel } from "../components/dropdowns";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import PageTitle from "../components/PageTitle";
import { useUploadedMaskNames } from "../hooks";
import ContinueBtn from "../components/buttons/ContinueBtn";
import PreviousBtn from "../components/buttons/PreviousBtn";
import { useNavigate } from "react-router-dom";

const MaskUpload = () => {
  const { data } = useUploadedMaskNames();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/upload_data/preview");
  };

  const handlePrevious = () => {
    navigate("/upload_data/images");
  };

  return (
    <>
      <PageTitle title="Segmentation Masks" />
      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={BiSolidImageAdd}
            title={{ base: "Upload Masks", md: "Upload Segmentation Masks" }}
            description={{
              base: "Select masks",
              md: "Click button to upload segmentation masks",
            }}
          />
          <MaskUploader />
        </HStack>
      </BoundingBox>
      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={IoLayers}
            title={{ base: "Mask Channels", md: "Number of Mask Channels" }}
            description={{ md: "Select the number of mask channels." }}
          />
          <MaskChannel />
        </HStack>
      </BoundingBox>
      <BoundingBox>
        <IconHeadingDescriptionCombo
          icon={TbLayersSelected}
          title="Selected Masks"
        />
        <Box overflowY="auto" maxHeight={{ base: "28vh", md: "55vh" }} mt={4}>
          {data?.results && data?.results.length > 0 ? (
            data?.results.map((name, index) => (
              <Text fontWeight="thin" fontSize="md" key={index}>
                {name}
              </Text>
            ))
          ) : (
            <Text color="red" fontWeight="thin" fontSize="md">
              Ready to get started? Select the corresponding masks.
            </Text>
          )}
        </Box>
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

export default MaskUpload;
