import { IoMdSettings } from "react-icons/io";
import {
  parentNames,
  useActiveNavColor,
  useActiveParent,
  useIsBackendRunning,
} from "../../../hooks";
import MainNavBarItem from "./MainNavBarItem";

const AugmentationConfigIcon = () => {
  const activeParent = useActiveParent();
  const { augmentationConfig } = parentNames;
  const { parentColor } = useActiveNavColor();
  const { data } = useIsBackendRunning();

  return (
    <MainNavBarItem
      icon={<IoMdSettings />}
      iconLabel="Input augmentation settings"
      to="/settings"
      backgroundColor={
        activeParent === augmentationConfig ? parentColor : "transparent"
      }
      tooltipLabel="Augmentation settings"
      disabled={!data?.success}
    />
  );
};

export default AugmentationConfigIcon;
