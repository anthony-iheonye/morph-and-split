import { IoMdSettings } from "react-icons/io";
import {
  useActiveParent,
  parentNames,
  useActiveNavColor,
} from "../../../hooks";
import MainNavBarItem from "./MainNavBarItem";

const AugmentationConfigIcon = () => {
  const activeParent = useActiveParent();
  const { augmentationConfig } = parentNames;
  const { parentColor } = useActiveNavColor();

  return (
    <MainNavBarItem
      icon={<IoMdSettings />}
      iconLabel="Input augmentation settings"
      to="/settings"
      backgroundColor={
        activeParent === augmentationConfig ? parentColor : "transparent"
      }
      tooltipLabel="Augmentation settings"
    />
  );
};

export default AugmentationConfigIcon;
