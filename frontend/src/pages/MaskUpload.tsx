import { Box, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
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
import {
  useBackendResponse,
  useImageMaskBalanceStatus,
  useImageUploadStatus,
  useMaskUploadStatus,
  useUploadedMaskNames,
} from "../hooks";
import DeleteMasks from "../components/buttons/DeleteMasks";

const MaskUpload = () => {
  const { data: maskData } = useUploadedMaskNames();
  const { data: imageUploadStatus } = useImageUploadStatus();
  const { data: maskUploadStatus } = useMaskUploadStatus();
  const { data: imageMaskBalance } = useImageMaskBalanceStatus();
  const { maskIsUploading } = useBackendResponse();

  const imbalanced =
    imageUploadStatus?.success &&
    maskUploadStatus?.success &&
    !imageMaskBalance?.success;

  return (
    <Grid
      templateAreas={{
        base: `"title"
               "uploader"
               "channels"
               "selectedMasks"
               "navBtn"`,
      }}
      templateColumns={{ base: "1fr" }}
      templateRows={{ base: "auto auto auto 1fr auto" }} // ✅ Ensures selectedMasks expands
      overflow="hidden"
    >
      <GridItem area="title" mt={8}>
        <PageTitle title="Segmentation Masks" />
      </GridItem>

      <GridItem area="uploader">
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
      </GridItem>

      <GridItem area="channels">
        <BoundingBox mt={0}>
          <HStack justify="space-between" align="start" width="100%">
            <IconHeadingDescriptionCombo
              icon={IoLayers}
              title={{ base: "Mask Channels", md: "Number of Mask Channels" }}
              description={{
                base: "Select channels",
                md: "Select the number of mask channels.",
              }}
            />
            <MaskChannel />
          </HStack>
        </BoundingBox>
      </GridItem>

      <GridItem
        area="selectedMasks"
        display="flex"
        flexDirection="column"
        flex="1"
        overflow="hidden"
      >
        <BoundingBox
          display="flex"
          flex="1"
          flexDirection="column"
          mt={0}
          overflow="hidden"
        >
          <HStack justify="space-between">
            <IconHeadingDescriptionCombo
              icon={TbLayersSelected}
              title="Selected Masks"
            />
            {maskUploadStatus?.success && <DeleteMasks />}
          </HStack>

          {imbalanced && (
            <Text color="red.500">{imageMaskBalance?.message}</Text>
          )}

          <Box mt={4} flex="1" overflowY="auto">
            {maskData?.results && maskData?.results.length > 0 ? (
              maskData.results.map((name, index) => (
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
      </GridItem>

      <GridItem area="navBtn">
        <BoundingBox transparent padding={0} mt={0}>
          <HStack justifyContent={{ base: "center", md: "start" }}>
            <PreviousBtn to="/upload_data/images" />
            <ContinueBtn
              to="/upload_data/preview"
              disable={
                !maskUploadStatus?.success ||
                !imageMaskBalance?.success ||
                maskIsUploading
              }
            />
          </HStack>
        </BoundingBox>
      </GridItem>
    </Grid>
  );
};

export default MaskUpload;
