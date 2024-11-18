import {
  Button,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BsFiletypeJson } from "react-icons/bs";
import useVisualAttributesFile from "../../hooks/useVisualAttributesFile";

const VisualAttributeFilePicker = () => {
  const { error, augConfig, handleFileChange } = useVisualAttributesFile();
  const fileName = augConfig.visualAttributesJSONFile?.name;

  return (
    <VStack align="start" mr="auto">
      <FormControl>
        <FormLabel fontSize="lg" fontWeight={700}>
          Visual Attribute Data
        </FormLabel>
        <Button
          size="sm"
          as="label"
          cursor="pointer"
          leftIcon={<Icon as={BsFiletypeJson} />}
        >
          Select file
          <Input
            type="file"
            variant="outline"
            padding="0"
            display="None"
            accept=".json"
            onChange={handleFileChange}
          />
        </Button>
      </FormControl>
      {fileName ? (
        <Text fontWeight="thin" fontSize="sm">
          {fileName}
        </Text>
      ) : (
        <Text color={"red"}>{error}</Text>
      )}
    </VStack>
  );
};

export default VisualAttributeFilePicker;
