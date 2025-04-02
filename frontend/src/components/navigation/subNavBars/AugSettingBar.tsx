import { Flex, Heading } from "@chakra-ui/react";
import { useBoundingBoxColor } from "../../../hooks";
import {
  Preprocess,
  Splitting,
  StratifiedSplitting,
  Transform,
} from "../subNavItems";

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
