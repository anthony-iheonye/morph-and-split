import {
  Checkbox,
  FormControl,
  Heading,
  Stack,
  VStack,
} from "@chakra-ui/react";
import useAugConfigAndSetter from "../../hooks/useAugConfigAndSetter";
import ResizeDimension from "./ResizeDimension";

const ResizeAugmentedResult = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <VStack align="start" width="100%">
      <Heading size="lg">Post-procesing</Heading>
      <Stack
        direction={{
          base: "column",
          md: "row",
        }}
      >
        <FormControl>
          <Checkbox
            colorScheme="teal"
            isChecked={augConfig.resizeAugImage}
            onChange={() =>
              setAugConfig("resizeAugImage", !augConfig.resizeAugImage)
            }
          >
            Resize augmented result
          </Checkbox>
        </FormControl>
        {augConfig.resizeAugImage ? <ResizeDimension /> : null}
      </Stack>
    </VStack>
  );
};

export default ResizeAugmentedResult;
