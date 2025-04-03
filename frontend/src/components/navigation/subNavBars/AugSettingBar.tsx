import { Flex, Heading } from "@chakra-ui/react";
import { useBoundingBoxColor } from "../../../hooks";
import {
  Preprocess,
  Splitting,
  StratifiedSplitting,
  Transform,
} from "../subNavItems";

/**
 * AugSettingBar component renders a bar for managing the augmentation settings.
 * It includes:
 * - A heading labeled "Augmentation Settings"
 * - Sub-navigation items for splitting data, stratified splitting, applying transformations, and preprocessing.
 *
 * The component uses Chakra UI's Flex component to arrange the elements in a responsive layout.
 * The background color is dynamically set using the `useBoundingBoxColor` hook.
 *
 * @returns {JSX.Element} A Flex container with a heading and navigation items for augmentation settings.
 */
const AugSettingBar = () => {
  const backgroundColor = useBoundingBoxColor();

  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      height={{ md: "100dvh" }}
      minHeight={{ md: "100%" }}
      padding="10px"
      gap={{ md: 7 }}
      bg={backgroundColor}
      justifyContent={{ base: "space-between", md: "flex-start" }}
    >
      <Heading as="h2" fontWeight={500} padding={2}>
        Settings
      </Heading>

      <Splitting />
      <StratifiedSplitting />
      <Transform />
      <Preprocess />
    </Flex>
  );
};

export default AugSettingBar;
