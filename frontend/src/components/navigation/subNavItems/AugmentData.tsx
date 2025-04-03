import { FaCirclePlay } from "react-icons/fa6";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
  useBackendResponse,
} from "../../../hooks";
import SubNavBarItem from "./SubNavBarItem";

/**
 * Component representing a navigation item that initiates data augmentation.
 *
 * Displays a clickable navigation button with an icon and descriptive label.
 * The button is conditionally disabled based on the backend state.
 */
const AugmentData = () => {
  /** Current active sub-navigation color scheme. */
  const { subParentColor } = useActiveNavColor();

  /** Currently active sub-navigation item identifier. */
  const activeSubParent = useActiveSubParent();

  /** Sub-navigation identifiers for various sections. */
  const { startAugmentation } = subParentNames;

  /** Backend status indicating if the service is shutting down, used to disable interaction. */
  const { isShuttingDown } = useBackendResponse();

  return (
    <SubNavBarItem
      icon={<FaCirclePlay />}
      iconLabel="Apply random transformations to images and their masks."
      text={{ md: "Start Augmentation" }}
      to="/augment/start_augmentation"
      backgroundColor={
        activeSubParent === startAugmentation ? subParentColor : "transparent"
      }
      disabled={isShuttingDown}
    />
  );
};

export default AugmentData;
