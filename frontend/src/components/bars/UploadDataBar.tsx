import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { IoImages, IoImagesOutline } from "react-icons/io5";
import { MdGridView } from "react-icons/md";
import { Link } from "react-router-dom";
import useActiveNavColor from "../../hooks/useActiveParentColor";
import useActiveSubParent from "../../hooks/useActiveSubParent";
import useBoundingBoxColor from "../../hooks/useBoundingBoxColor";
import { subParentNames } from "../../store/navStore";

const UploadDataBar = () => {
  const { colorMode } = useColorMode();
  const backgroundColor = useBoundingBoxColor();
  const { activeSubParent, setActiveSubParent } = useActiveSubParent();

  const { subParentColor } = useActiveNavColor();
  const { uploadImages, uploadMasks, previewUpload } = subParentNames;

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
        Dataset
      </Heading>
      <Link
        to={"/upload_data/images"}
        onClick={() => setActiveSubParent(uploadImages)}
      >
        <Tooltip label="Select Images" placement="top-start">
          <HStack
            gap={0}
            backgroundColor={
              activeSubParent === uploadImages ? subParentColor : "transparent"
            }
          >
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
        </Tooltip>
      </Link>

      <Link
        to={"/upload_data/masks"}
        onClick={() => setActiveSubParent(uploadMasks)}
      >
        <Tooltip label="Select segmentation masks" placement="top-start">
          <HStack
            gap={0}
            backgroundColor={
              activeSubParent === uploadMasks ? subParentColor : "transparent"
            }
          >
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
        </Tooltip>
      </Link>

      <Link
        to={"/upload_data/preview"}
        onClick={() => setActiveSubParent(previewUpload)}
      >
        <Tooltip label="Preview images and masks" placement="top-start">
          <HStack
            gap={0}
            backgroundColor={
              activeSubParent === previewUpload ? subParentColor : "transparent"
            }
          >
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
        </Tooltip>
      </Link>
    </Flex>
  );
};

export default UploadDataBar;
