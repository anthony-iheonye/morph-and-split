import { FaMagic } from "react-icons/fa";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
} from "../../../hooks";
import SubNavBarItem from "./SubNavBarItem";

/**
 * Transform component renders a navigation item for applying random transformations.
 * It provides the user with an option to select and apply various transformations to images and their masks.
 * It uses the SubNavBarItem component to display the item in the sub-navigation bar.
 *
 * @returns {JSX.Element} A SubNavBarItem element that links to the select transformation settings page.
 */
const Transform = () => {
  const { subParentColor } = useActiveNavColor();
  const activeSubParent = useActiveSubParent();
  const { transformation } = subParentNames;

  return (
    <SubNavBarItem
      icon={<FaMagic />}
      iconLabel="Apply random transformations."
      text={{ md: "Transformations" }}
      to={"/settings/select_transformation"}
      backgroundColor={
        activeSubParent === transformation ? subParentColor : "transparent"
      }
      tooltipLabel="Select transformations"
    />
  );
};

export default Transform;
