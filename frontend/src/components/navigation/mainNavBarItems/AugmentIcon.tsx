import { TbTransformFilled } from "react-icons/tb";
import { MainNavBarItem } from ".";
import {
  parentNames,
  useActiveNavColor,
  useActiveParent,
  useBackendResponse,
  useImageMaskBalanceStatus,
  useImageUploadStatus,
  useIsBackendRunning,
} from "../../../hooks";

/**
 * AugmentIcon renders a navigation item that initiates the augmentation process.
 * It displays a transformation icon and applies dynamic styles based on the current state of the app.
 * The navigation item is disabled under certain conditions, such as:
 * - Image upload not being successful
 * - Backend is not running
 * - Image mask balance check not successful
 * - The system is shutting down
 *
 * @returns {JSX.Element} A navigation item linking to the augmentation page, with dynamic states and a tooltip.
 */
const AugmentIcon = () => {
  const activeParent = useActiveParent();
  const { augment } = parentNames;
  const { parentColor } = useActiveNavColor();
  const { data: imageUploaded } = useImageUploadStatus();
  const { data: backendIsRunning } = useIsBackendRunning();
  const { data: imageMaskBalance } = useImageMaskBalanceStatus();
  const { isShuttingDown } = useBackendResponse();

  return (
    <MainNavBarItem
      icon={<TbTransformFilled />}
      iconLabel="Initiate Augmentation"
      to="/augment"
      backgroundColor={activeParent === augment ? parentColor : "transparent"}
      tooltipLabel="Initiate Augmentation"
      disabled={
        !imageUploaded?.success ||
        !backendIsRunning?.success ||
        !imageMaskBalance?.success ||
        isShuttingDown
      }
    />
  );
};

export default AugmentIcon;
