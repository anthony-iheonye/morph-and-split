import { MdGridView } from "react-icons/md";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
  useAugmentationIsComplete,
  useBackendResponse,
} from "../../../hooks";
import SubNavBarItem from "./SubNavBarItem";

/**
 * AugmentationResult renders a sub-navigation item that links to the page
 * for previewing augmented results.
 *
 * It includes:
 * - A grid icon representing the preview section.
 * - A label and tooltip for accessibility and guidance.
 * - Dynamic highlighting when active.
 * - Disabling when augmentation is still running or hasn't completed.
 */
const AugmentationResult = () => {
  const { subParentColor } = useActiveNavColor(); // Color for active sub-navigation item
  const activeSubParent = useActiveSubParent(); // Currently active sub-parent name
  const { previewResult } = subParentNames;
  const { augmentationIsRunning } = useBackendResponse();
  const { data: augmentationCompleted } = useAugmentationIsComplete();

  return (
    <SubNavBarItem
      icon={<MdGridView />}
      iconLabel="Preview augmented results."
      text={{ md: "Preview Result" }}
      to="/augment/preview"
      backgroundColor={
        activeSubParent === previewResult ? subParentColor : "transparent"
      }
      tooltipLabel="Preview augmentation data"
      disabled={augmentationIsRunning || !augmentationCompleted?.success}
    />
  );
};

export default AugmentationResult;
