import { IoImagesOutline } from "react-icons/io5";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
  useImageUploadStatus,
} from "../../../hooks";
import SubNavBarItem from "./SubNavBarItem";

/**
 * UploadMasks component renders a navigation item for uploading segmentation masks.
 * It allows users to select and upload segmentation masks after uploading images.
 * The navigation item is disabled if images have not been uploaded successfully.
 * It uses the SubNavBarItem component to display the item in the sub-navigation bar.
 *
 * @returns {JSX.Element} A SubNavBarItem element that links to the segmentation mask upload page.
 */
const UploadMasks = () => {
  const { subParentColor } = useActiveNavColor();
  const { uploadMasks } = subParentNames;
  const activeSubParent = useActiveSubParent();
  const { data: imageUploaded } = useImageUploadStatus();

  return (
    <SubNavBarItem
      icon={<IoImagesOutline />}
      iconLabel="Select segmentation masks"
      text={{ md: "Segmentation Masks" }}
      to={"/upload_data/masks"}
      backgroundColor={
        activeSubParent === uploadMasks ? subParentColor : "transparent"
      }
      tooltipLabel="Select segmentation masks"
      disabled={!imageUploaded?.success}
    />
  );
};

export default UploadMasks;
