import { MdGridView } from "react-icons/md";
import { SubNavBarItem } from ".";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
  useImageMaskBalanceStatus,
  useImageUploadStatus,
} from "../../../hooks";

/**
 * PreviewUploads renders a sub-navigation item for previewing uploaded images and masks.
 *
 * This component displays:
 * - A grid icon representing the preview action.
 * - The ability to navigate to the preview route (`/upload_data/preview`).
 * - Dynamic highlighting when it is the active sub-navigation item.
 * - A tooltip to guide the user about the action.
 * - A disabled state when either image upload or mask balance hasn't been completed successfully.
 */
const PreviewUploads = () => {
  const { subParentColor } = useActiveNavColor(); // Color for active sub-nav item
  const { previewUpload } = subParentNames; // Reference to the 'previewUpload' sub-parent name
  const activeSubParent = useActiveSubParent(); // Currently active sub-parent route
  const { data: imageUploaded } = useImageUploadStatus(); // Status of the image upload process
  const { data: imageMaskBalance } = useImageMaskBalanceStatus(); // Status of the image and mask balance

  return (
    <SubNavBarItem
      icon={<MdGridView />}
      iconLabel="Preview uploaded images and masks"
      text={{ md: "Preview" }}
      to={"/upload_data/preview"}
      backgroundColor={
        activeSubParent === previewUpload ? subParentColor : "transparent"
      }
      tooltipLabel="Preview uploaded images and masks"
      disabled={!imageUploaded?.success || !imageMaskBalance?.success} // Disable if image upload or mask balance is incomplete
    />
  );
};

export default PreviewUploads;
