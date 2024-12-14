import { Switch } from "@chakra-ui/react";
import useAugConfigAndSetter from "../../../hooks/useAugConfigAndSetter";
import useNavStore from "../../../store/navStore";

const ViewState = () => {
  const { augConfig } = useAugConfigAndSetter();
  const { activeParent, activeSubParent } = useNavStore((store) => ({
    activeParent: store.activeParent,
    activeSubParent: store.activeSubParent,
  }));

  return (
    <Switch
      id="augmentValSet"
      colorScheme="teal"
      onChange={() =>
        console.log(
          augConfig,
          { activaeParent: activeParent },
          { activeSubparent: activeSubParent }
        )
      }
    />
  );
};

export default ViewState;
