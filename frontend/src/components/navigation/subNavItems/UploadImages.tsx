import { IoImages } from "react-icons/io5";
import { SubNavBarItem } from ".";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
} from "../../../hooks";

/**
 * UploadImages component renders a navigation item for uploading images.
 * It provides the user with an option to select and upload images from their device.
 * It uses the SubNavBarItem component to display the item in the sub-navigation bar.
 *
 * @returns {JSX.Element} A SubNavBarItem element that links to the image upload page.
 */
const UploadImages = () => {
  const { subParentColor } = useActiveNavColor();
  const { uploadImages } = subParentNames;
  const activeSubParent = useActiveSubParent();

  return (
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
  );
};

export default UploadImages;
