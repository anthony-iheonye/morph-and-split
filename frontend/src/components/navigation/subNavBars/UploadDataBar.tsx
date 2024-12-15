import { Flex, Heading } from "@chakra-ui/react";
import { IoImages, IoImagesOutline } from "react-icons/io5";
import { MdGridView } from "react-icons/md";
import {
  useBoundingBoxColor,
  useActiveNavColor,
  subParentNames,
  useActiveSubParent,
} from "../../../hooks";
import SubNavBarItem from "../subNavItems/SubNavBarItem";

const UploadDataBar = () => {
  const backgroundColor = useBoundingBoxColor();
  const { subParentColor } = useActiveNavColor();

  const { uploadImages, uploadMasks, previewUpload } = subParentNames;
  const activeSubParent = useActiveSubParent();

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

      <SubNavBarItem
        icon={<IoImages />}
        iconLabel="Upload Images"
        text={{ md: "Images" }}
        to="/upload_data/images"
        backgroundColor={
          activeSubParent === uploadImages ? subParentColor : "transparent"
        }
        tooltipLabel="Select Images"
      />

      <SubNavBarItem
        icon={<IoImagesOutline />}
        iconLabel="Select segmentation masks"
        text={{ md: "Segmentation Masks" }}
        to={"/upload_data/masks"}
        backgroundColor={
          activeSubParent === uploadMasks ? subParentColor : "transparent"
        }
        tooltipLabel="Select segmentation masks"
      />

      <SubNavBarItem
        icon={<MdGridView />}
        iconLabel="Preview uploaded images and masks"
        text={{ md: "Preview" }}
        to={"/upload_data/preview"}
        backgroundColor={
          activeSubParent === previewUpload ? subParentColor : "transparent"
        }
        tooltipLabel="Preview uploaded images and masks"
      />
    </Flex>
  );
};

export default UploadDataBar;
