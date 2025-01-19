import { Flex, Heading } from "@chakra-ui/react";
import { useBoundingBoxColor } from "../../../hooks";
import { AugmentationResult, AugmentData } from "../subNavItems";

const AugmentBar = () => {
  const backgroundColor = useBoundingBoxColor();

  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      height={{ md: "100vh" }}
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
