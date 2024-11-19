import { Switch } from "@chakra-ui/react";
import useAugConfigStore from "../store";

const PreviewSwitch = () => {
  const { setPreviewSelection } = useAugConfigStore((state) => ({
    setPreviewSelection: state.setPreviewSelection,
  }));
  const previewSelection = useAugConfigStore((state) => state.previewSelection);

  return (
    <Switch
      colorScheme="green"
      isChecked={previewSelection === true}
      onChange={() => setPreviewSelection(!previewSelection)}
    />
  );
};

export default PreviewSwitch;
