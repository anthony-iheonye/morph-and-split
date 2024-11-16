import { HStack, Switch, Text } from "@chakra-ui/react";
import useAugConfigStore from "../store";

const PreviewSwitch = () => {
  const { setPreviewSelection } = useAugConfigStore((state) => ({
    setPreviewSelection: state.setPreviewSelection,
  }));
  const previewSelection = useAugConfigStore((state) => state.previewSelection);

  return (
    <HStack>
      <Switch
        colorScheme="green"
        isChecked={previewSelection === true}
        onChange={() => setPreviewSelection(!previewSelection)}
      />
      <Text whiteSpace="nowrap">Preview selection</Text>
    </HStack>
  );
};

export default PreviewSwitch;
