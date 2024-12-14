import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { FaMagic } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { PiCirclesThreeFill, PiResizeBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import useActiveNavColor from "../../../hooks/useActiveParentColor";
import useActiveSubParent from "../../../hooks/useActiveSubParent";
import useBoundingBoxColor from "../../../hooks/useBoundingBoxColor";
import { subParentNames } from "../../../store/navStore";

const AugSettingBar = () => {
  const { colorMode } = useColorMode();
  const backgroundColor = useBoundingBoxColor();
  const { activeSubParent, setActiveSubParent } = useActiveSubParent();

  const { subParentColor } = useActiveNavColor();
  const { dataSplit, transformation, visualAtttributes, preProcessing } =
    subParentNames;

  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      height={{ md: "100vh" }}
      minHeight={{ md: "100%" }}
      padding="10px"
      gap={{ md: 7 }}
      bg={backgroundColor}
    >
      <Heading as="h2" fontWeight={500} padding={2}>
        Settings
      </Heading>
      <Link
        to={"/settings/data_split"}
        onClick={() => setActiveSubParent(dataSplit)}
      >
        <Tooltip
          label="Split data into train, val & test sets "
          placement="top-start"
        >
          <HStack
            gap={0}
            backgroundColor={
              activeSubParent === dataSplit ? subParentColor : "transparent"
            }
          >
            <IconButton
              aria-label="Split data into train, val and test sets."
              icon={<PiCirclesThreeFill />}
              variant="ghost"
              size="lg"
              fontSize="1.5rem"
              colorScheme={colorMode === "dark" ? "yellow" : "teal"}
            />
            <Text>Data split</Text>
          </HStack>
        </Tooltip>
      </Link>

      <Link
        to={"/settings/select_transformation"}
        onClick={() => setActiveSubParent(transformation)}
      >
        <Tooltip label="Select transformations" placement="top-start">
          <HStack
            gap={0}
            backgroundColor={
              activeSubParent === transformation
                ? subParentColor
                : "transparent"
            }
          >
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
        </Tooltip>
      </Link>

      <Link
        to={"/settings/visual_attributes"}
        onClick={() => setActiveSubParent(visualAtttributes)}
      >
        <Tooltip label="Select visual attribute file" placement="top-start">
          <HStack
            gap={0}
            backgroundColor={
              activeSubParent === visualAtttributes
                ? subParentColor
                : "transparent"
            }
          >
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
        </Tooltip>
      </Link>

      <Link
        to={"/settings/pre_processing"}
        onClick={() => setActiveSubParent(preProcessing)}
      >
        <Tooltip label="Apply pre-processing steps" placement="top-start">
          <HStack
            gap={0}
            backgroundColor={
              activeSubParent === preProcessing ? subParentColor : "transparent"
            }
          >
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
        </Tooltip>
      </Link>
    </Flex>
  );
};

export default AugSettingBar;
