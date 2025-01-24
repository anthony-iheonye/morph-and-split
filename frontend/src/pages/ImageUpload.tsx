import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoLayers } from "react-icons/io5";
import { TbLayersSelected } from "react-icons/tb";
import {
  ContinueBtn,
  DeleteImages,
  ImageUploader,
} from "../components/buttons";
import { BoundingBox } from "../components/display";
import { ImageChannel } from "../components/dropdowns";
import {
  IconHeadingDescriptionCombo,
  PageTitle,
} from "../components/miscellaneous";
import {
  useBackendResponse,
  useImageMaskBalanceStatus,
  useImageUploadStatus,
  useMaskUploadStatus,
  useUploadedImageNames,
} from "../hooks";

const ImageUpload = () => {
  const { data } = useUploadedImageNames();
  const { data: imageUploadStatus } = useImageUploadStatus();
  const { data: maskUploadStatus } = useMaskUploadStatus();
  const { imageIsUploading } = useBackendResponse();
  const { data: imageMaskBalance } = useImageMaskBalanceStatus();

  const imbalanced =
    imageUploadStatus?.success &&
    maskUploadStatus?.success &&
    !imageMaskBalance?.success;

  return (
    <>
      <PageTitle title="Images" />

      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={BiSolidImageAdd}
            title="Upload Images"
            description={{
              base: "Select images",
              md: "Click button to upload images for augmentation.",
            }}
          />
          <ImageUploader />
        </HStack>
      </BoundingBox>

      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={IoLayers}
            title={{ base: "Image Channels", md: "Number of Image Channels" }}
            description={{
              base: "Image channels",
              md: "Select the number of image channels.",
            }}
          />
          <ImageChannel />
        </HStack>
      </BoundingBox>

      <BoundingBox>
        <HStack justify="space-between">
          <IconHeadingDescriptionCombo
            icon={TbLayersSelected}
            title="Selected Images"
          />
          {imageUploadStatus?.success && <DeleteImages />}
        </HStack>

        {imbalanced && <Text color="red.500">{imageMaskBalance?.message}</Text>}

        <Box overflowY="auto" maxHeight={{ base: "28vh", md: "48vh" }} mt={4}>
          {data?.results && data?.results.length > 0 ? (
            data?.results.map((name, index) => (
              <Text fontWeight="thin" fontSize="md" key={index}>
                {name}
              </Text>
            ))
          ) : (
            <Text color="red" fontWeight="thin" fontSize="md">
              Ready to get started? Upload one or more images.
            </Text>
          )}
        </Box>
      </BoundingBox>

      <BoundingBox transparent padding={0}>
        <ContinueBtn
          to="/upload_data/masks"
          disable={!imageUploadStatus?.success || imageIsUploading}
        />
      </BoundingBox>
    </>
  );
};

export default ImageUpload;
