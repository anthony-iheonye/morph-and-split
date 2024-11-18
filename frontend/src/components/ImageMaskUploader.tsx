import { Box, IconButton } from "@chakra-ui/react";
import { FaFileUpload } from "react-icons/fa";
import useNavIconColor from "../hooks/useNavIconColor";

const ImageMaskUploader = () => {
  const backgroundColor = useNavIconColor();

  return (
    <Box width="auto" alignSelf="center">
      <IconButton
        aria-label="Upload Image and segmentation mask"
        icon={<FaFileUpload />}
        variant="ghost"
        size="lg"
        fontSize="1.5rem"
        colorScheme={backgroundColor}
      />
    </Box>
  );
};

export default ImageMaskUploader;
