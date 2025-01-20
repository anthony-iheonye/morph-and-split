import { TbTransformFilled } from "react-icons/tb";
import { MainNavBarItem } from ".";
import {
  parentNames,
  useActiveNavColor,
  useActiveParent,
  useIsBackendRunning,
} from "../../../hooks";

const AugmentIcon = () => {
  const activeParent = useActiveParent();
  const { augment } = parentNames;
  const { parentColor } = useActiveNavColor();
  const { data } = useIsBackendRunning();

  return (
    <MainNavBarItem
      icon={<TbTransformFilled />}
      iconLabel="Initiate Augmentation"
      to="/augment"
      backgroundColor={activeParent === augment ? parentColor : "transparent"}
      tooltipLabel="Initiate Augmentation"
      disabled={!data?.success}
    />
  );
};

export default AugmentIcon;
