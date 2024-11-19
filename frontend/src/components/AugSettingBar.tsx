import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { FaLayerGroup, FaMagic } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { PiResizeBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import useBoundingBoxColor from "../hooks/useBoundingBoxColor";

const AugSettingBar = () => {
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
        Settings
      </Heading>
      <Link to={"/settings/data_split"}>
        <HStack gap={0}>
          <IconButton
            aria-label="Split data into train, val and test sets."
            icon={<FaLayerGroup />}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={colorMode === "dark" ? "yellow" : "teal"}
          />
          <Text>Data split</Text>
        </HStack>
      </Link>

      <Link to={"/settings/select_transformation"}>
        <HStack gap={0}>
          <IconButton
            aria-label="Apply random transformations"
            icon={<FaMagic />}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={colorMode === "dark" ? "yellow" : "teal"}
          />
          <Text>Transformations</Text>
        </HStack>
      </Link>

      <Link to={"/settings/visual_attributes_file"}>
        <HStack gap={0}>
          <IconButton
            aria-label="Select visual attributes JSON file"
            icon={<IoIosColorPalette />}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={colorMode === "dark" ? "yellow" : "teal"}
          />
          <Text>Visual attributes</Text>
        </HStack>
      </Link>

      <Link to={"/settings/pre_processing"}>
        <HStack gap={0}>
          <IconButton
            aria-label="Apply pre-processing values"
            icon={<PiResizeBold />}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={colorMode === "dark" ? "yellow" : "teal"}
          />
          <Text>Pre-processing</Text>
        </HStack>
      </Link>
    </Flex>
  );
};

export default AugSettingBar;
