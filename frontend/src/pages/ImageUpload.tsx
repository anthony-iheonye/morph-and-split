import { Box, HStack, Text } from "@chakra-ui/react";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoLayers } from "react-icons/io5";
import { TbLayersSelected } from "react-icons/tb";
import BoundingBox from "../components/BoundingBox";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import ImageChannel from "../components/ImageChannel";
import ImageSelector from "../components/ImageSelector";
import useAugConfigAndSetter from "../hooks/useAugConfigAndSetter";
import PageTitle from "../components/PageTitle";

const ImageUpload = () => {
  const { augConfig } = useAugConfigAndSetter();
  const images = augConfig.images;

  return (
    <>
      <PageTitle title="Images" />
      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={BiSolidImageAdd}
            title="Select Images"
            description="Click button to select images for augmentation."
          />
          <ImageSelector />
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
        <Box overflowY="auto" maxHeight="400px" mt={4}>
          {images && images?.length > 0 ? (
            images?.map((image) => (
              <Text fontWeight="thin" fontSize="md" key={image.id}>
                {image.name}
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
