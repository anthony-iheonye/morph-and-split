import { Box, IconButton, useColorMode } from "@chakra-ui/react";
import { TbTransformFilled } from "react-icons/tb";

const AugmentIcon = () => {
  const { colorMode } = useColorMode();

  return (
    <Box width="auto" alignSelf="center">
      <IconButton
        aria-label="Upload Image and segmentation mask"
        icon={<TbTransformFilled />}
        variant="ghost"
        size="lg"
        fontSize="1.5rem"
        colorScheme={colorMode === "dark" ? "yellow" : "teal"}
      />
    </Box>
  );
};

export default AugmentIcon;
