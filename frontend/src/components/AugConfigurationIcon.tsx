import { Box, IconButton, useColorMode } from "@chakra-ui/react";
import { IoMdSettings } from "react-icons/io";

const AugmentationConfigIcon = () => {
  const { colorMode } = useColorMode();

  return (
    <Box width="auto" alignSelf="center">
      <IconButton
        aria-label="Upload Image and segmentation mask"
        icon={<IoMdSettings />}
        variant="ghost"
        size="lg"
        fontSize="1.5rem"
        colorScheme={colorMode === "dark" ? "yellow" : "teal"}
      />
    </Box>
  );
};

export default AugmentationConfigIcon;
