import { TbTransformFilled } from "react-icons/tb";
import { MainNavBarItem } from ".";
import {
  parentNames,
  useActiveNavColor,
  useActiveParent,
} from "../../../hooks";

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
