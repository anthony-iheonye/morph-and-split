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

const MaskUpload = () => {
  const { data } = useUploadedMaskNames();

  return (
    <>
      <PageTitle title="Segmentation Masks" />
      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={BiSolidImageAdd}
            title={{ base: "Upload Mask", md: "Upload Segmentation Masks" }}
            description="Click button to select masks for augmentation."
          />
          <MaskUploader />
        </HStack>
      </BoundingBox>
      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={IoLayers}
            title={{ base: "Channels", md: "Number of Mask Channels" }}
            description="Select the number of mask channels."
          />
          <MaskChannel />
        </HStack>
      </BoundingBox>
      <BoundingBox>
        <IconHeadingDescriptionCombo
          icon={TbLayersSelected}
          title="Selected Masks"
        />
        <Box overflowY="auto" maxHeight="400px" mt={4}>
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
    </>
  );
};

export default MaskUpload;
