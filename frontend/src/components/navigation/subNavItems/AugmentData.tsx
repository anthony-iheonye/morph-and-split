import { FaCirclePlay } from "react-icons/fa6";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
  useBackendResponse,
} from "../../../hooks";
import SubNavBarItem from "./SubNavBarItem";

const AugmentData = () => {
  const { subParentColor } = useActiveNavColor();
  const activeSubParent = useActiveSubParent();
  const { startAugmentation } = subParentNames;
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
