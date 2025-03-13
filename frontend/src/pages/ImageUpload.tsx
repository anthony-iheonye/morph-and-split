import { Box, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { BiSolidImageAdd } from "react-icons/bi";
import { TbLayersSelected } from "react-icons/tb";
import {
  ContinueBtn,
  DeleteImages,
  ImageUploader,
} from "../components/buttons";
import { BoundingBox } from "../components/display";
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
  const { data: uploadedImages } = useUploadedImageNames();
  const { data: imageUploadStatus } = useImageUploadStatus();
  const { data: maskUploadStatus } = useMaskUploadStatus();
  const { imageIsUploading } = useBackendResponse();
  const { data: imageMaskBalance } = useImageMaskBalanceStatus();

  const imbalanced =
    imageUploadStatus?.success &&
    maskUploadStatus?.success &&
    !imageMaskBalance?.success;

  return (
    <Grid
      templateAreas={{
        base: `"title"
               "uploader"
               "selectedImages"
               "navBtn"`,
      }}
      templateColumns={{ base: "1fr" }}
      templateRows={{ base: "auto auto 1fr auto" }}
      overflow="hidden"
    >
      <GridItem area="title" mt={8}>
        <PageTitle title="Images" />
      </GridItem>

      <GridItem area="uploader">
        <BoundingBox>
          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={BiSolidImageAdd}
              title="Upload Images"
              description={{
                base: "Select images (.jpg, .png, .bmp)",
                md: "Click button to upload images for augmentation. (.jpg, .png, .bmp)",
              }}
            />
            <ImageUploader />
          </HStack>
        </BoundingBox>
      </GridItem>

      {/* <GridItem area="channels">
        <BoundingBox mt={0}>
          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={IoLayers}
              title={{ base: "Image Channels", md: "Number of Image Channels" }}
              description={{
                base: "Select image channels",
                md: "Select the number of image channels.",
              }}
            />
            <ImageChannel />
          </HStack>
        </BoundingBox>
      </GridItem> */}

      <GridItem
        area="selectedImages"
        display="flex"
        flexDirection="column"
        flex="1"
        overflowY="hidden"
      >
        <BoundingBox
          display="flex"
          flex="1"
          flexDirection="column"
          mt={0}
          overflowY="hidden"
        >
          <HStack justify="space-between">
            <IconHeadingDescriptionCombo
              icon={TbLayersSelected}
              title="Selected Images"
            />
            {imageUploadStatus?.success && <DeleteImages />}
          </HStack>

          {imbalanced && (
            <Text color="red.500">{imageMaskBalance?.message}</Text>
          )}

          <Box overflowY="auto" mt={4} flex="1">
            {uploadedImages?.results && uploadedImages?.results.length > 0 ? (
              uploadedImages?.results.map((name, index) => (
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
      </GridItem>

      <GridItem area="navBtn">
        <BoundingBox
          transparent
          padding={0}
          mt={0}
          justifyContent={{ base: "center", md: "start" }}
          display="flex"
        >
          <ContinueBtn
            to="/upload_data/masks"
            disable={!imageUploadStatus?.success || imageIsUploading}
          />
        </BoundingBox>
      </GridItem>
    </Grid>
  );
};

export default ImageUpload;
