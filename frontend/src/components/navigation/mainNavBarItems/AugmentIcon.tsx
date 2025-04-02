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
