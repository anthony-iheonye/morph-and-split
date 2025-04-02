import { PiResizeBold } from "react-icons/pi";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
} from "../../../hooks";
import SubNavBarItem from "./SubNavBarItem";

const Preprocess = () => {
  const { subParentColor } = useActiveNavColor();
  const activeSubParent = useActiveSubParent();
  const { preProcessing } = subParentNames;

  return (
    <SubNavBarItem
      icon={<PiResizeBold />}
      iconLabel="Set image and mask preprocessing configuration."
      text={{ md: "Pre-processing" }}
      to={"/settings/pre_processing"}
      backgroundColor={
        activeSubParent === preProcessing ? subParentColor : "transparent"
      }
      tooltipLabel="Apply pre-processing steps"
    />
  );
};

export default Preprocess;
