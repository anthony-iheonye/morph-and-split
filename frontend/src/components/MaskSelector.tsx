import { Button, Input, VStack } from "@chakra-ui/react";
import AugMask from "../entities/Mask";
import useFileSelector from "../hooks/useFileSelector";
import useAugConfigStore from "../store";

const MaskSelector = () => {
  const setMasks = useAugConfigStore((state) => state.setMasks);

  const { handleFileChange } = useFileSelector<AugMask>(setMasks);
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

export default MaskSelector;
