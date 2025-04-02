import { MdGridView } from "react-icons/md";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
  useAugmentationIsComplete,
  useBackendResponse,
} from "../../../hooks";
import SubNavBarItem from "./SubNavBarItem";

const AugmentationResult = () => {
  const { subParentColor } = useActiveNavColor();
  const activeSubParent = useActiveSubParent();
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
      tooltipLabel="Preveiw augmentation data"
      disabled={augmentationIsRunning || !augmentationCompleted?.success}
    />
  );
};

export default AugmentationResult;
