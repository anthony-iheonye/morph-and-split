import { Box, IconButton } from "@chakra-ui/react";
import { IoMdSettings } from "react-icons/io";
import { Link } from "react-router-dom";
import useNavIconColor from "../hooks/useNavIconColor";

const AugmentationConfigIcon = () => {
  const backgroundColor = useNavIconColor();

  return (
    <Box width="auto" alignSelf="center">
      <Link to={"/settings"}></Link>
      <IconButton
        aria-label="Upload Image and segmentation mask"
        icon={<IoMdSettings />}
        variant="ghost"
        size="lg"
        fontSize="1.5rem"
        colorScheme={backgroundColor}
      />
    </Box>
  );
};

export default AugmentationConfigIcon;
