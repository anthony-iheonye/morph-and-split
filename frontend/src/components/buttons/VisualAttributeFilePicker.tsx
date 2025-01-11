import { Button, Input, Text, VStack } from "@chakra-ui/react";
import { useVisualAttributesFile } from "../../hooks";

const VisualAttributeFilePicker = () => {
  const { error, augConfig, handleFileChange } = useVisualAttributesFile();
  const fileName = augConfig.visualAttributesJSONFile?.name;

  return (
    <VStack>
      <Button
        as="label"
        cursor="pointer"
        // leftIcon={<Icon as={BsFiletypeJson} />}
      >
        Select file
        <Input
          type="file"
          variant="outline"
          padding="0"
          display="None"
          accept=".csv"
          onChange={handleFileChange}
        />
      </Button>
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
