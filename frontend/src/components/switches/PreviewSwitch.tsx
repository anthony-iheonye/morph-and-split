import { Switch } from "@chakra-ui/react";
import useAugConfigStore from "../../store/augConfigStore";

const PreviewSwitch = () => {
  const { previewSelection, setPreviewSelection } = useAugConfigStore(
    (state) => ({
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
