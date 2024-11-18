import { Box, IconButton } from "@chakra-ui/react";
import { TbTransformFilled } from "react-icons/tb";
import useNavIconColor from "../hooks/useNavIconColor";

const AugmentIcon = () => {
  const backgroundColor = useNavIconColor();

  return (
    <Box width="auto" alignSelf="center">
      <IconButton
        aria-label="Upload Image and segmentation mask"
        icon={<TbTransformFilled />}
        variant="ghost"
        size="lg"
        fontSize="1.5rem"
        colorScheme={backgroundColor}
      />
    </Box>
  );
};

export default AugmentIcon;
