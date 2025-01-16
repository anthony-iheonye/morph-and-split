import { Switch } from "@chakra-ui/react";
import { useAugConfigAndSetter, useBackendResponse } from "../../../hooks";

const ViewState = () => {
  const { augConfig } = useAugConfigAndSetter();
  const { backendResponseLog } = useBackendResponse();

  return (
    <Switch
      id="augmentValSet"
      colorScheme="teal"
      onChange={() => {
        console.log(augConfig, backendResponseLog);
      }}
    />
  );
};

export default ViewState;
