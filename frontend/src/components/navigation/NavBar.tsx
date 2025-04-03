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

/**
 * NavBar component renders the main vertical or horizontal navigation bar for the application.
 *
 * This component includes:
 * - A clickable company logo that redirects to the home page.
 * - Icon buttons for navigating to different sections such as uploading data, configuring augmentation, starting augmentation, and resetting the app.
 * - A color mode toggle to switch between light and dark themes.
 *
 * It is responsive:
 * - On mobile (`base`), items are laid out in a row.
 * - On medium (`md`) and larger screens, items are arranged in a vertical column.
 */
const NavBar = () => {
  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      height={{ md: "100dvh" }}
      minHeight={{ md: "100%" }}
      padding="10px"
    >
      {/* Clickable logo redirects to home */}
      <Link to={"/"}>
        <CompanyLogo />
      </Link>

      {/* Navigation icons for major app functions */}
      <Flex
        direction={{ base: "row", md: "column" }}
        justifyContent="space-evenly"
        flexGrow={1}
      >
        <ImageMaskUploader />
        <AugmentationConfigIcon />
        <AugmentIcon />
        <ResetIcon />
        {/* <ViewState /> Uncomment if state debugging is needed */}
      </Flex>

      {/* Color mode toggle positioned at bottom/end */}
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
