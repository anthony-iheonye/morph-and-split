import { Button, Input, VStack } from "@chakra-ui/react";
import AugImage from "../entities/AugImage";
import useFileSelector from "../hooks/useFileSelector";
import useAugConfigStore from "../store";

const ImageSelector = () => {
  const setImages = useAugConfigStore((state) => state.setImages);

  const { handleFileChange } = useFileSelector<AugImage>(setImages);
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

export default ImageSelector;
