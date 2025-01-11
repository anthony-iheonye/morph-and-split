import { Box, HStack, Text } from "@chakra-ui/react";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoLayers } from "react-icons/io5";
import { TbLayersSelected } from "react-icons/tb";
import { ContinueBtn, MaskUploader, PreviousBtn } from "../components/buttons";
import { BoundingBox } from "../components/display";
import { MaskChannel } from "../components/dropdowns";
import {
  IconHeadingDescriptionCombo,
  PageTitle,
} from "../components/miscellaneous";
import { useUploadedMaskNames } from "../hooks";

const MaskUpload = () => {
  const { data } = useUploadedMaskNames();

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
          <PreviousBtn to="/upload_data/images" />
          <ContinueBtn to="/upload_data/preview" />
        </HStack>
      </BoundingBox>
    </>
  );
};

export default MaskUpload;
