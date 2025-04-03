import { Switch } from "@chakra-ui/react";
import { useAugConfigAndSetter, useBackendResponse } from "../../../hooks";

/**
 * ViewState component displays a toggle switch and logs the state of
 * augmentation configuration and backend response when changed.
 *
 * States:
 * - `augConfig`: Holds the augmentation configuration, used to control image transformations and other settings.
 * - `backendResponseLog`: Holds the log of backend responses, used to monitor the state of backend operations.
 *
 * Side Effects:
 * - Logs the current `augConfig` and `backendResponseLog` to the console when the switch is toggled.
 */
const ViewState = () => {
  const { augConfig } = useAugConfigAndSetter(); // State: Holds the current augmentation configuration
  const { backendResponseLog } = useBackendResponse(); // State: Holds the backend response log tracking ongoing operations

  return (
    <Switch
      id="augmentValSet"
      colorScheme="teal"
      onChange={() => {
        // Side Effect: Logs the current `augConfig` and `backendResponseLog` to the console when toggled
        console.log(augConfig, backendResponseLog);
      }}
    />
  );
};

export default ViewState;
