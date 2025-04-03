import { Flex, Heading } from "@chakra-ui/react";
import { useBoundingBoxColor } from "../../../hooks";
import { AugmentationResult, AugmentData } from "../subNavItems";

/**
 * AugmentBar component renders a bar for managing the augmentation process.
 * It includes:
 * - A heading labeled "Augment"
 * - Sub-navigation items for starting the augmentation and viewing the results.
 *
 * The component uses Chakra UI's Flex component to arrange the elements in a responsive layout.
 * The background color is dynamically set using the `useBoundingBoxColor` hook.
 *
 * @returns {JSX.Element} A Flex container with a heading and navigation items for augmentation.
 */
const AugmentBar = () => {
  const backgroundColor = useBoundingBoxColor();

  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      height={{ md: "100dvh" }}
      minHeight={{ md: "100%" }}
      padding="10px"
      gap={{ base: 4, md: 8 }}
      bg={backgroundColor}
      justifyContent={{ base: "space-between", md: "flex-start" }}
    >
      <Heading as="h2" fontWeight={500} padding={2}>
        Augment
      </Heading>

      <AugmentData />
      <AugmentationResult />
    </Flex>
  );
};

export default AugmentBar;
