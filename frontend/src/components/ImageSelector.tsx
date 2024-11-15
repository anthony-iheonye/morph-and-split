import { Button, Icon, Input, Text, VStack } from "@chakra-ui/react";
import { BsImages } from "react-icons/bs";
import useFileSelector from "../hooks/useFileSelector";
import useAugConfigStore from "../store";

const ImageSelector = () => {
  const setImages = useAugConfigStore((state) => state.setImages);
  // const filePaths = useAugConfigStore((state) => state.augConfig.images) || [];

  const { error, handleFileChange } = useFileSelector(setImages);
  return (
    <VStack>
      <Button
        leftIcon={<Icon as={BsImages} />}
        as="label"
        variant="outline"
        cursor="pointer"
        padding={2}
      >
        Select Images
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

      {error ? <Text>{error}</Text> : null}
    </VStack>
  );
};

export default ImageSelector;
