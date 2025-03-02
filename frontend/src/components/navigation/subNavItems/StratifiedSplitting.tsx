import { IoIosColorPalette } from "react-icons/io";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
} from "../../../hooks";
import SubNavBarItem from "./SubNavBarItem";

const StratifiedSplitting = () => {
  const { subParentColor } = useActiveNavColor();
  const activeSubParent = useActiveSubParent();
  const { visualAtttributes } = subParentNames;

  return (
    <SubNavBarItem
      icon={<IoIosColorPalette />}
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
