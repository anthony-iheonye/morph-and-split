import { Switch } from "@chakra-ui/react";
import useAugConfigStore, { AugConfigStore } from "../../store/augConfigStore";

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
