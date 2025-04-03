import { PiCirclesThreeFill } from "react-icons/pi";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
} from "../../../hooks";
import SubNavBarItem from "./SubNavBarItem";

/**
 * Splitting renders a sub-navigation item for the data splitting configuration page.
 *
 * This component displays:
 * - A circles icon representing the data splitting action.
 * - The ability to navigate to the data split route (`/settings/data_split`).
 * - Dynamic highlighting when it is the active sub-navigation item.
 * - A tooltip to guide the user about the action.
 */
const Splitting = () => {
  const { subParentColor } = useActiveNavColor(); // Color for active sub-nav item
  const activeSubParent = useActiveSubParent(); // Currently active sub-parent route
  const { dataSplit } = subParentNames; // Reference to the 'dataSplit' sub-parent name

  return (
    <SubNavBarItem
      icon={<PiCirclesThreeFill />}
      iconLabel="Split data into train, val and test sets"
      text={{ md: "Data Split" }}
      to={"/settings/data_split"}
      backgroundColor={
        activeSubParent === dataSplit ? subParentColor : "transparent"
      }
      tooltipLabel="Split data into train, val and test sets"
    />
  );
};

export default Splitting;
