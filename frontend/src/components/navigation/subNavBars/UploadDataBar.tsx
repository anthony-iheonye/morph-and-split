import { Flex, Heading } from "@chakra-ui/react";
import { useBoundingBoxColor } from "../../../hooks";
import { PreviewUploads, UploadImages, UploadMasks } from "../subNavItems";

/**
 * UploadDataBar component renders a bar for managing dataset upload actions.
 * It includes:
 * - A heading labeled "Dataset"
 * - Sub-navigation items for uploading images, uploading segmentation masks, and previewing uploads.
 *
 * The component uses Chakra UI's Flex component to arrange the elements in a responsive layout.
 * The background color is dynamically set using the `useBoundingBoxColor` hook.
 *
 * @returns {JSX.Element} A Flex container with a heading and navigation items for dataset upload actions.
 */
const UploadDataBar = () => {
  const backgroundColor = useBoundingBoxColor();

  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      height={{ md: "100dvh" }}
      minHeight={{ md: "100%" }}
      padding={{ base: "8px", md: "10px" }}
      gap={{ md: 8 }}
      bg={backgroundColor}
      justifyContent={{ base: "space-between", md: "flex-start" }}
      width={{ base: "100%" }}
    >
      <Heading as="h2" fontWeight={500} padding={2}>
        Dataset
      </Heading>

      <UploadImages />
      <UploadMasks />
      <PreviewUploads />
    </Flex>
  );
};

export default UploadDataBar;
