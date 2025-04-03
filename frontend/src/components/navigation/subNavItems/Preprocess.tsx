import { PiResizeBold } from "react-icons/pi";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
} from "../../../hooks";
import SubNavBarItem from "./SubNavBarItem";

/**
 * Preprocess renders a sub-navigation item for accessing the image and mask preprocessing configuration.
 *
 * This component includes:
 * - A resize icon to visually indicate the pre-processing step.
 * - Navigation to the preprocessing settings route (`/settings/pre_processing`).
 * - A dynamic highlight when it is the active sub-navigation item.
 * - Tooltip information to guide the user.
 */
const Preprocess = () => {
  const { subParentColor } = useActiveNavColor(); // Color for active sub-nav item
  const activeSubParent = useActiveSubParent(); // Currently active sub-parent route
  const { preProcessing } = subParentNames; // Reference to the 'preProcessing' sub-parent name

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
