import { FaFileUpload } from "react-icons/fa";
import {
  parentNames,
  useActiveNavColor,
  useActiveParent,
  useBackendResponse,
  useIsBackendRunning,
} from "../../../hooks";
import MainNavBarItem from "./MainNavBarItem";

/**
 * ImageMaskUploader component represents a main navigation bar item for uploading images and segmentation masks.
 * It is displayed as a button with an upload icon and label, which directs the user to the upload page.
 * The button's state is dynamically disabled based on the backend and augmentation status.
 *
 * - The button is disabled when:
 *   - The backend is not running (`backendRunning?.success` is false),
 *   - The augmentation process is running (`augmentationIsRunning` is true),
 *   - The system is shutting down (`isShuttingDown` is true),
 *   - The system is resetting (`isResetting` is true).
 *
 * @returns {JSX.Element} The main navigation bar item for uploading images and segmentation masks.
 */
const ImageMaskUploader = () => {
  const activeParent = useActiveParent();
  const { uploadImageAndMask } = parentNames;
  const { parentColor } = useActiveNavColor();
  const { data: backendRunning } = useIsBackendRunning();
  const { augmentationIsRunning, isShuttingDown, isResetting } =
    useBackendResponse();

  return (
    <MainNavBarItem
      icon={<FaFileUpload />}
      iconLabel="Upload Image and segmentation mask"
      to="/upload_data"
      backgroundColor={
        activeParent === uploadImageAndMask ? parentColor : "transparent"
      }
      tooltipLabel="Upload data"
      disabled={
        !backendRunning?.success ||
        augmentationIsRunning ||
        isShuttingDown ||
        isResetting
      }
    />
  );
};

export default ImageMaskUploader;
