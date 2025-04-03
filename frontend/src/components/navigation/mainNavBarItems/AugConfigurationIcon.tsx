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

/**
 * AugmentationConfigIcon renders a navigation item for accessing the augmentation settings.
 * It displays a settings icon and applies dynamic styles based on the current state of the app.
 * The navigation item is disabled under certain conditions, such as:
 * - Image upload not being successful
 * - Backend is not running
 * - Image mask balance check not successful
 * - Augmentation is currently running
 * - The system is shutting down or resetting
 *
 * @returns {JSX.Element} A navigation item linking to the augmentation settings page, with dynamic states and a tooltip.
 */
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
