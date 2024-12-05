import { Box, HStack, Text } from "@chakra-ui/react";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoLayers } from "react-icons/io5";
import { TbLayersSelected } from "react-icons/tb";
import BoundingBox from "../components/BoundingBox";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import ImageChannel from "../components/ImageChannel";
import ImageUploader from "../components/ImageUploader";
import PageTitle from "../components/PageTitle";
import useUploadedImageNames from "../hooks/useUploadedImageNames";

const ImageUpload = () => {
  const { data, isLoading } = useUploadedImageNames();

  return (
    <>
      <PageTitle title="Images" />
      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={BiSolidImageAdd}
            title="Upload Images"
            description="Click button to select images for augmentation."
          />
          <ImageUploader />
        </HStack>
      </BoundingBox>
      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={IoLayers}
            title="Number of Image Channels"
            description="Select the number of image channels from the dropdown list."
          />
          <ImageChannel />
        </HStack>
      </BoundingBox>
      <BoundingBox>
        <IconHeadingDescriptionCombo
          icon={TbLayersSelected}
          title="Selected Images"
        />
        <Box overflowY="auto" maxHeight="320px" mt={4}>
          {data?.results && data?.results.length > 0 ? (
            data?.results.map((name, index) => (
              <Text fontWeight="thin" fontSize="md" key={index}>
                {name}
              </Text>
            ))
          ) : (
            <Text color="red" fontWeight="thin" fontSize="md">
              Ready to get started? Select one or more images.
            </Text>
          )}
        </Box>
      </BoundingBox>
    </>
  );
};

export default ImageUpload;
