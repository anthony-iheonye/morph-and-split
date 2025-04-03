import { Switch } from "@chakra-ui/react";
import useAugConfigStore, { AugConfigStore } from "../../store/augConfigStore";

/**
 * PreviewSwitch toggles the state of `previewSelection` in the augmentation config store.
 * This controls whether the user wants to preview uploaded data (images or masks).
 */
const PreviewSwitch = () => {
  const { previewSelection, setPreviewSelection } = useAugConfigStore(
    (state: AugConfigStore) => ({
      setPreviewSelection: state.setPreviewSelection,
      previewSelection: state.previewSelection,
    })
  );

  return (
    <Switch
      colorScheme="green"
      isChecked={previewSelection === true}
      onChange={() => setPreviewSelection(!previewSelection)}
    />
  );
};

export default PreviewSwitch;
