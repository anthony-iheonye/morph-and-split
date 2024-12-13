import { Box, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import AugmentationConfigIcon from "../navigation/mainNavItems/AugConfigurationIcon";
import AugmentIcon from "../navigation/mainNavItems/AugmentIcon";
import ColorModeSwitch from "../navigation/mainNavItems/ColorModeSwitch";
import CompanyLogo from "../CompanyLogo";
import ImageMaskUploader from "../navigation/mainNavItems/ImageMaskUploader";
import ResetIcon from "../navigation/mainNavItems/ResetIcon";
import ViewState from "../ViewState";

const NavBar = () => {
  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      height={{ md: "100vh" }}
      minHeight={{ md: "100%" }}
      padding="10px"
    >
      <Link to={"/upload_data"}>
        <CompanyLogo />
      </Link>

      <Flex
        direction={{ base: "row", md: "column" }}
        justifyContent="space-evenly"
        flexGrow={1}
      >
        <ImageMaskUploader />
        <AugmentationConfigIcon />
        <AugmentIcon />
        <ResetIcon />
        <ViewState />
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
