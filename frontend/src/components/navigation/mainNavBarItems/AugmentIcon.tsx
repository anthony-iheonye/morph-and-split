import { TbTransformFilled } from "react-icons/tb";
import {
  useActiveParent,
  parentNames,
  useActiveNavColor,
} from "../../../hooks";
import MainNavBarItem from "./MainNavBarItem";

const AugmentIcon = () => {
  const activeParent = useActiveParent();
  const { augment } = parentNames;
  const { parentColor } = useActiveNavColor();

  return (
    <MainNavBarItem
      icon={<TbTransformFilled />}
      iconLabel="Initiate Augmentation"
      to="/augment"
      backgroundColor={activeParent === augment ? parentColor : "transparent"}
      tooltipLabel="Initiate Augmentation"
    />
  );
};

export default AugmentIcon;
