import { VStack, Button, Input } from "@chakra-ui/react";
import AugMask from "../entities/AugMask";
import useFileSelector from "../hooks/useFileSelector";
import useAugConfigStore from "../store/augConfigStore";

const AugmentedMaskSelector = () => {
  const setAugmentedMasks = useAugConfigStore(
    (state) => state.setAugmentedMasks
  );

  const { handleFileChange } = useFileSelector<AugMask>(setAugmentedMasks);
  return (
    <VStack>
      <Button as="label" variant="outline" cursor="pointer">
        Click
        <Input
          type="file"
          multiple
          variant="outline"
          padding="0"
          display="None"
          accept=".png, .jpeg, .jpg"
          onChange={handleFileChange}
        />
      </Button>
    </VStack>
  );
};

export default AugmentedMaskSelector;
