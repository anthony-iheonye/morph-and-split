import { Button, Input, VStack } from "@chakra-ui/react";
import AugImage from "../entities/Image";
import useFileSelector from "../hooks/useFileSelector";
import useAugConfigStore from "../store";

const AugmentedImageSelector = () => {
  const setAugmentedImages = useAugConfigStore(
    (state) => state.setAugmentedImages
  );

  const { handleFileChange } = useFileSelector<AugImage>(setAugmentedImages);
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

export default AugmentedImageSelector;
