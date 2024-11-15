import { Button, Icon, Input, Text, VStack } from "@chakra-ui/react";
import { BsImages } from "react-icons/bs";
import useFileSelector from "../hooks/useFileSelector";
import useAugConfigStore from "../store";

const MaskSelector = () => {
  const setMasks = useAugConfigStore((state) => state.setMasks);
  // const filePaths = useAugConfigStore((state) => state.augConfig.masks) || [];

  const { error, handleFileChange } = useFileSelector(setMasks);
  return (
    <VStack>
      <Button
        leftIcon={<Icon as={BsImages} />}
        as="label"
        variant="outline"
        cursor="pointer"
        padding={2}
      >
        Select Masks
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

export default MaskSelector;
