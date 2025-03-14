import { Switch } from "@chakra-ui/react";
import { AugConfigStore, useAugConfigStore } from "../../store";

const PreviewAugResultSwitch = () => {
  const { previewAugmentedResult, setPreviewAugmentedResult } =
    useAugConfigStore((state: AugConfigStore) => ({
      previewAugmentedResult: state.previewAugmentedResult,
      setPreviewAugmentedResult: state.setPreviewAugmentedResult,
    }));

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
