import { FaFileUpload } from "react-icons/fa";
import {
  parentNames,
  useActiveNavColor,
  useActiveParent,
  useBackendResponse,
  useIsBackendRunning,
} from "../../../hooks";
import MainNavBarItem from "./MainNavBarItem";

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
