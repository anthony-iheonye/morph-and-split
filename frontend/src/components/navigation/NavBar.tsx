import { Box, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { CompanyLogo } from "../miscellaneous";
import {
  AugmentationConfigIcon,
  AugmentIcon,
  ColorModeSwitch,
  ImageMaskUploader,
  ResetIcon,
  // ViewState,
} from "./mainNavBarItems";

const NavBar = () => {
  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      height={{ md: "100dvh" }}
      minHeight={{ md: "100%" }}
      padding="10px"
    >
      <Link to={"/"}>
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
        {/* <ViewState /> */}
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
