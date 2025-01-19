import { Flex, Heading } from "@chakra-ui/react";
import { useBoundingBoxColor } from "../../../hooks";
import { PreviewUploads, UploadImages, UploadMasks } from "../subNavItems";

const UploadDataBar = () => {
  const backgroundColor = useBoundingBoxColor();

  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      height={{ md: "100vh" }}
      minHeight={{ md: "100%" }}
      padding="10px"
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
