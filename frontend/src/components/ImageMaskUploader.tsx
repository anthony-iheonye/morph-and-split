import { Box, IconButton, useColorMode } from "@chakra-ui/react";
import { FaFileUpload } from "react-icons/fa";

const ImageMaskUploader = () => {
  const { colorMode } = useColorMode();

  return (
    <Box width="auto" alignSelf="center">
      <IconButton
        aria-label="Upload Image and segmentation mask"
        icon={<FaFileUpload />}
        variant="ghost"
        size="lg"
        fontSize="1.5rem"
        colorScheme={colorMode === "dark" ? "yellow" : "teal"}
      />
    </Box>
  );
};

export default ImageMaskUploader;
