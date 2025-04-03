import { Switch } from "@chakra-ui/react";
import { AugConfigStore, useAugConfigStore } from "../../store";

/**
 * PreviewAugResultSwitch is a toggle component that allows users
 * to enable or disable the preview of augmented results.
 */
const PreviewAugResultSwitch = () => {
  const { previewAugmentedResult, setPreviewAugmentedResult } =
    useAugConfigStore((state: AugConfigStore) => ({
      previewAugmentedResult: state.previewAugmentedResult,
      setPreviewAugmentedResult: state.setPreviewAugmentedResult,
    }));

  /**
   * Toggles the previewAugmentedResult boolean in the store.
   */
  const toggleSwitch = async () => {
    const nextPreviewState = !previewAugmentedResult; // Calculate the next state
    setPreviewAugmentedResult(nextPreviewState); // Update the state
  };

  return (
    <Switch
      colorScheme="green"
      isChecked={previewAugmentedResult === true}
      onChange={toggleSwitch}
    />
  );
};

export default PreviewAugResultSwitch;
