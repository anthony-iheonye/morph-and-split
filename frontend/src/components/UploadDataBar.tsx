import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { IoImages, IoImagesOutline } from "react-icons/io5";
import { MdGridView } from "react-icons/md";
import { Link } from "react-router-dom";
import useBoundingBoxColor from "../hooks/useBoundingBoxColor";

const UploadDataBar = () => {
  const { colorMode } = useColorMode();
  const backgroundColor = useBoundingBoxColor();

  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      height={{ md: "100vh" }}
      padding="10px"
      gap={{ md: 5 }}
      bg={backgroundColor}
    >
      <Heading as="h2" fontWeight={500} padding={2}>
        Dataset
      </Heading>
      <Link to={"/upload_data/images"}>
        <HStack gap={0}>
          <IconButton
            aria-label="Upload Images."
            icon={<IoImages />}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={colorMode === "dark" ? "yellow" : "teal"}
          />
          <Text>Images</Text>
        </HStack>
      </Link>

      <Link to={"/upload_data/masks"}>
        <HStack gap={0}>
          <IconButton
            aria-label="Upload masks"
            icon={<IoImagesOutline />}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={colorMode === "dark" ? "yellow" : "teal"}
          />
          <Text>Segmentation Masks</Text>
        </HStack>
      </Link>

      <Link to={"/upload_data/preview"}>
        <HStack gap={0}>
          <IconButton
            aria-label="Preview selected image and masks"
            icon={<MdGridView />}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={colorMode === "dark" ? "yellow" : "teal"}
          />
          <Text>Preview</Text>
        </HStack>
      </Link>
    </Flex>
  );
};

export default UploadDataBar;
