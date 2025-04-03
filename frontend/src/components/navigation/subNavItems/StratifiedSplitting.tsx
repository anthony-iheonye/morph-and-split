import { FaScaleBalanced } from "react-icons/fa6";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
} from "../../../hooks";
import SubNavBarItem from "./SubNavBarItem";

/**
 * StratifiedSplitting renders a sub-navigation item for selecting the visual attributes file.
 *
 * This component displays:
 * - A scale icon representing the stratified splitting action.
 * - The ability to navigate to the stratified splitting configuration page (`/settings/stratified_splitting`).
 * - Dynamic highlighting when it is the active sub-navigation item.
 * - A tooltip to guide the user about the action.
 */
const StratifiedSplitting = () => {
  const { subParentColor } = useActiveNavColor(); // Color for active sub-nav item
  const activeSubParent = useActiveSubParent(); // Currently active sub-parent route
  const { visualAtttributes } = subParentNames; // Reference to the 'visualAtttributes' sub-parent name

  return (
    <SubNavBarItem
      icon={<FaScaleBalanced />}
      iconLabel="Select visual attributes JSON file"
      text={{ md: "Stratified Splitting" }}
      to={"/settings/stratified_splitting"}
      backgroundColor={
        activeSubParent === visualAtttributes ? subParentColor : "transparent"
      }
      tooltipLabel="Select visual attribute file"
    />
  );
};

export default StratifiedSplitting;
