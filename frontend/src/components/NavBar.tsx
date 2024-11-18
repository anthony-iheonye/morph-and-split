import { Box, Flex } from "@chakra-ui/react";
import AugmentationConfigIcon from "./AugConfigurationIcon";
import AugmentIcon from "./AugmentIcon";
import ColorModeSwitch from "./ColorModeSwitch";
import CompanyLogo from "./CompanyLogo";
import ImageMaskUploader from "./ImageMaskUploader";

const NavBar = () => {
  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      height={{ md: "100vh" }}
      padding="10px"
    >
      <Flex
        direction={{ base: "row", md: "column" }}
        gap={{ base: 20, md: 20 }}
        flexGrow={1}
      >
        <CompanyLogo />
        <ImageMaskUploader />
        <AugmentationConfigIcon />
        <AugmentIcon />
      </Flex>

      <Box
        alignSelf={{ base: "flex-end", md: "center" }}
        mb={{ base: 1, md: 4 }}
      >
        <ColorModeSwitch />
      </Box>
    </Flex>
  );
};

export default NavBar;
