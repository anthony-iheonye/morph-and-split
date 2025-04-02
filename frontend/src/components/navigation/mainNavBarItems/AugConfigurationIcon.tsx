import { IoMdSettings } from "react-icons/io";
import {
  parentNames,
  useActiveNavColor,
  useActiveParent,
  useBackendResponse,
  useImageMaskBalanceStatus,
  useImageUploadStatus,
  useIsBackendRunning,
} from "../../../hooks";
import MainNavBarItem from "./MainNavBarItem";

const AugmentationConfigIcon = () => {
  const activeParent = useActiveParent();
  const { augmentationConfig } = parentNames;
  const { parentColor } = useActiveNavColor();
  const { data: imageUploaded } = useImageUploadStatus();
  const { data: backendIsRunning } = useIsBackendRunning();
  const { data: imageMaskBalance } = useImageMaskBalanceStatus();
  const { augmentationIsRunning, isShuttingDown, isResetting } =
    useBackendResponse();

  return (
    <MainNavBarItem
      icon={<IoMdSettings />}
      iconLabel="Input augmentation settings"
      to="/settings"
      backgroundColor={
        activeParent === augmentationConfig ? parentColor : "transparent"
      }
      tooltipLabel="Augmentation settings"
      disabled={
        !imageUploaded?.success ||
        !backendIsRunning?.success ||
        !imageMaskBalance?.success ||
        augmentationIsRunning ||
        isShuttingDown ||
        isResetting
      }
    />
  );
};

export default AugmentationConfigIcon;
