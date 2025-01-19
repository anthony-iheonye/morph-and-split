import { PiCirclesThreeFill } from "react-icons/pi";
import {
  subParentNames,
  useActiveNavColor,
  useActiveSubParent,
} from "../../../hooks";
import SubNavBarItem from "./SubNavBarItem";

const Splitting = () => {
  const { subParentColor } = useActiveNavColor();
  const activeSubParent = useActiveSubParent();
  const { dataSplit } = subParentNames;

  return (
    <SubNavBarItem
      icon={<PiCirclesThreeFill />}
      iconLabel="Split data into train, val and test sets."
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
