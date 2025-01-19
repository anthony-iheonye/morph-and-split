import { FaMagic } from "react-icons/fa";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
} from "../../../hooks";
import SubNavBarItem from "./SubNavBarItem";

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
