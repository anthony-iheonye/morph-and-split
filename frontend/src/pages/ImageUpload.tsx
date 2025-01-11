import { Box, HStack, Text } from "@chakra-ui/react";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoLayers } from "react-icons/io5";
import { TbLayersSelected } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { ImageUploader } from "../components/buttons";
import ContinueBtn from "../components/buttons/ContinueBtn";
import { BoundingBox } from "../components/display";
import { ImageChannel } from "../components/dropdowns";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import PageTitle from "../components/PageTitle";
import { useUploadedImageNames } from "../hooks";

const ImageUpload = () => {
  const { data } = useUploadedImageNames();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/upload_data/masks");
  };

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
              md: "Click button to select images for augmentation.",
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
              // base: "Image channels",
              md: "Select the number of image channels.",
            }}
          />
          <ImageChannel />
        </HStack>
      </BoundingBox>

      <BoundingBox>
        <IconHeadingDescriptionCombo
          icon={TbLayersSelected}
          title="Selected Images"
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
              Ready to get started? Select one or more images.
            </Text>
          )}
        </Box>
      </BoundingBox>

      <BoundingBox transparent padding={0}>
        <ContinueBtn label="Continue" setContinue={handleContinue} />
      </BoundingBox>
    </>
  );
};

export default ImageUpload;
