import { Box, IconButton } from "@chakra-ui/react";
import { FaFileUpload } from "react-icons/fa";
import useNavIconColor from "../hooks/useNavIconColor";
import { Link } from "react-router-dom";

const ImageMaskUploader = () => {
  const backgroundColor = useNavIconColor();

  return (
    <Box width="auto" alignSelf="center">
      <Link to={"/upload_data"}>
        <IconButton
          aria-label="Upload Image and segmentation mask"
          icon={<FaFileUpload />}
          variant="ghost"
          size="lg"
          fontSize="1.5rem"
          colorScheme={backgroundColor}
        />
      </Link>
    </Box>
  );
};

export default ImageMaskUploader;
