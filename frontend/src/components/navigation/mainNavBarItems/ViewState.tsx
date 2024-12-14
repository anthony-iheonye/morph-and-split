import { Switch } from "@chakra-ui/react";
import useAugConfigAndSetter from "../../../hooks/useAugConfigAndSetter";

const ViewState = () => {
  const { augConfig } = useAugConfigAndSetter();

  return (
    <Switch
      id="augmentValSet"
      colorScheme="teal"
      onChange={() => console.log(augConfig)}
    />
  );
};

export default ViewState;
