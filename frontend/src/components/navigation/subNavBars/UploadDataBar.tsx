import { Flex, Heading } from "@chakra-ui/react";
import { IoImages, IoImagesOutline } from "react-icons/io5";
import { MdGridView } from "react-icons/md";
import { useLocation } from "react-router-dom";
import useActiveNavColor from "../../../hooks/useActiveNavColor";
import useBoundingBoxColor from "../../../hooks/useBoundingBoxColor";
import { subParentNames } from "../../../store/navStore";
import SubNavBarItem from "../subNavItems/SubNavBarItem";

const UploadDataBar = () => {
  const location = useLocation();

  const backgroundColor = useBoundingBoxColor();

  const { subParentColor } = useActiveNavColor();
  const { uploadImages, uploadMasks, previewUpload } = subParentNames;

  // Determine active subNavBar item based on current route.
  const activeSubParent =
    location.pathname === "/upload_data"
      ? uploadImages
      : location.pathname === "/upload_data/images"
      ? uploadImages
      : location.pathname === "/upload_data/masks"
      ? uploadMasks
      : location.pathname === "/upload_data/preview"
      ? previewUpload
      : null;

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

      <SubNavBarItem
        icon={<IoImages />}
        iconLabel="Upload Images"
        text="Images"
        to="/upload_data/images"
        backgroundColor={
          activeSubParent === uploadImages ? subParentColor : "transparent"
        }
        tooltipLabel="Select Images"
      />

      <SubNavBarItem
        icon={<IoImagesOutline />}
        iconLabel="Select segmentation masks"
        text={{ base: "Masks", md: "Segmentation Masks" }}
        to={"/upload_data/masks"}
        backgroundColor={
          activeSubParent === uploadMasks ? subParentColor : "transparent"
        }
        tooltipLabel="Select segmentation masks"
      />

      <SubNavBarItem
        icon={<MdGridView />}
        iconLabel="Preview uploaded images and masks"
        text="Preview"
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
