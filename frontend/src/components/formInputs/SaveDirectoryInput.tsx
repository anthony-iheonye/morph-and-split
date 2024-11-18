import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import useAugConfigAndSetter from "../../hooks/useAugConfigAndSetter";

const SaveDirectoryInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <FormControl isRequired>
      <FormLabel>Save directory</FormLabel>
      <Input
        placeholder="Directory where augmentation results will be saved"
        value={augConfig.saveDirectory}
        onChange={(e) => setAugConfig("saveDirectory", e.target.value)}
      />
      <FormErrorMessage>Save directory is required.</FormErrorMessage>
    </FormControl>
  );
};

export default SaveDirectoryInput;
