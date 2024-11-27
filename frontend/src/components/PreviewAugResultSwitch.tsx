import { Switch } from "@chakra-ui/react";
import useAugConfigStore from "../store/augConfigStore";

const PreviewAugResultSwitch = () => {
  const { setPreviewAugmentedResult } = useAugConfigStore((state) => ({
    setPreviewAugmentedResult: state.setPreviewAugmentedResult,
  }));
  const previewAugmentedResult = useAugConfigStore(
    (state) => state.previewAugmentedResult
  );

  return (
    <Switch
      colorScheme="green"
      isChecked={previewAugmentedResult === true}
      onChange={() => setPreviewAugmentedResult(!previewAugmentedResult)}
    />
  );
};

export default PreviewAugResultSwitch;
