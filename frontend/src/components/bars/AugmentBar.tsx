import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { FaCirclePlay } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useBoundingBoxColor from "../../hooks/useBoundingBoxColor";
import { MdGridView } from "react-icons/md";

const AugmentBar = () => {
  const { colorMode } = useColorMode();
  const backgroundColor = useBoundingBoxColor();

  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      height={{ md: "100vh" }}
      minHeight={{ md: "100%" }}
      padding="10px"
      gap={{ md: 8 }}
      bg={backgroundColor}
    >
      <Heading as="h2" fontWeight={500} padding={2}>
        Augment
      </Heading>

      <Link to={"/augment/start_augmentation"}>
        <HStack gap={0}>
          <IconButton
            aria-label="Apply random transformations"
            icon={<FaCirclePlay />}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={colorMode === "dark" ? "yellow" : "teal"}
          />
          <Text>Start Augmentation</Text>
        </HStack>
      </Link>

      <Link to={"/augment/preview"}>
        <Tooltip label="Preveiw augmentation results" placement="top-start">
          <HStack gap={0}>
            <IconButton
              aria-label="Preview augmented results"
              icon={<MdGridView />}
              variant="ghost"
              size="lg"
              fontSize="1.5rem"
              colorScheme={colorMode === "dark" ? "yellow" : "teal"}
            />
            <Text>Preview Result</Text>
          </HStack>
        </Tooltip>
      </Link>
    </Flex>
  );
};

export default AugmentBar;
