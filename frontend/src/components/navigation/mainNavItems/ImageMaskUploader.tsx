import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { FaFileUpload } from "react-icons/fa";
import { Link } from "react-router-dom";
import useActiveParent from "../../../hooks/useActiveParent";
import useNavIconColor from "../../../hooks/useNavIconColor";
import { parentNames } from "../../../store/navStore";
import useActiveNavColor from "../../../hooks/useActiveParentColor";

const ImageMaskUploader = () => {
  const backgroundColor = useNavIconColor();
  const { activeParent, setActiveParent } = useActiveParent();

  const parentName = parentNames.uploadImageAndMask;
  const { parentColor } = useActiveNavColor();

  return (
    <Box width="auto" alignSelf="center">
      <Link to={"/upload_data"} onClick={() => setActiveParent(parentName)}>
        <Tooltip label="Upload data" placement="top-start">
          <IconButton
            aria-label="Upload Image and segmentation mask"
            icon={<FaFileUpload />}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={backgroundColor}
            backgroundColor={
              activeParent === parentName ? parentColor : "transparent"
            }
          />
        </Tooltip>
      </Link>
    </Box>
  );
};

export default ImageMaskUploader;
