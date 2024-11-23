import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { FaFileUpload } from "react-icons/fa";
import useNavIconColor from "../hooks/useNavIconColor";
import { Link } from "react-router-dom";

const ImageMaskUploader = () => {
  const backgroundColor = useNavIconColor();

  return (
    <Box width="auto" alignSelf="center">
      <Link to={"/upload_data"}>
        <Tooltip label="Upload data" placement="top-start">
          <IconButton
            aria-label="Upload Image and segmentation mask"
            icon={<FaFileUpload />}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={backgroundColor}
          />
        </Tooltip>
      </Link>
    </Box>
  );
};

export default ImageMaskUploader;
