import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { FaCirclePlay } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useBoundingBoxColor from "../../../hooks/useBoundingBoxColor";
import { MdGridView } from "react-icons/md";
import useActiveSubParent from "../../../hooks/useActiveSubParent";
import { subParentNames } from "../../../store/navStore";
import useActiveNavColor from "../../../hooks/useActiveParentColor";

const AugmentBar = () => {
  const { colorMode } = useColorMode();
  const backgroundColor = useBoundingBoxColor();
  const { activeSubParent, setActiveSubParent } = useActiveSubParent();

  const { subParentColor } = useActiveNavColor();
  const { startAugmentation, previewResult } = subParentNames;

  // Use breakpoint value to determine the text
  const startText = useBreakpointValue({
    base: "Start", // Small screens
    md: "Start Augmentation", // Medium and larger screens
  });
  const previewText = useBreakpointValue({
    base: "Preview", // Small screens
    md: "Preview Result", // Medium and larger screens
  });

  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      height={{ md: "100vh" }}
      minHeight={{ md: "100%" }}
      padding="10px"
      gap={{ base: 4, md: 8 }}
      bg={backgroundColor}
    >
      <Heading as="h2" fontWeight={500} padding={2}>
        Augment
      </Heading>

      <Link
        to={"/augment/start_augmentation"}
        onClick={() => setActiveSubParent(startAugmentation)}
      >
        <HStack
          gap={0}
          backgroundColor={
            activeSubParent === startAugmentation
              ? subParentColor
              : "transparent"
          }
        >
          <IconButton
            aria-label="Apply random transformations"
            icon={<FaCirclePlay />}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={colorMode === "dark" ? "yellow" : "teal"}
          />
          <Text>{startText}</Text>
        </HStack>
      </Link>

      <Link
        to={"/augment/preview"}
        onClick={() => setActiveSubParent(previewResult)}
      >
        <Tooltip label="Preveiw augmentation results" placement="top-start">
          <HStack
            gap={0}
            backgroundColor={
              activeSubParent === previewResult ? subParentColor : "transparent"
            }
          >
            <IconButton
              aria-label="Preview augmented results"
              icon={<MdGridView />}
              variant="ghost"
              size="lg"
              fontSize="1.5rem"
              colorScheme={colorMode === "dark" ? "yellow" : "teal"}
            />
            <Text>{previewText}</Text>
          </HStack>
        </Tooltip>
      </Link>
    </Flex>
  );
};

export default AugmentBar;
