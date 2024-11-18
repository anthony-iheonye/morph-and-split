import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  Select,
  Stack,
} from "@chakra-ui/react";
import useAugConfigAndSetter from "../../hooks/useAugConfigAndSetter";

const ImageMaskChannelInput = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <FormControl>
      <FormLabel>Number of channels</FormLabel>
      <Stack
        direction={{
          base: "column",
          md: "row",
        }}
        alignItems="start"
        spacing={6}
      >
        <InputGroup size="sm" maxWidth="100%">
          <InputLeftAddon width="5.5rem">Image</InputLeftAddon>
          <Select
            placeholder="Select image channels"
            value={augConfig.imageMaskChannels?.imgChannels}
            onChange={(event) =>
              setAugConfig("imageMaskChannels", {
                ...augConfig.imageMaskChannels,
                imgChannels: parseInt(event.target.value),
                maskChannels: augConfig.imageMaskChannels!.maskChannels,
              })
            }
          >
            <option value={1}>1 - Binary/Grayscale</option>
            <option value={3}>3 - RGB</option>
          </Select>
        </InputGroup>

        <InputGroup size="sm">
          <InputLeftAddon width="5.5rem">Mask</InputLeftAddon>
          <Select
            placeholder="Select mask channels"
            // defaultValue={1}
            value={augConfig.imageMaskChannels?.maskChannels}
            onChange={(e) =>
              setAugConfig("imageMaskChannels", {
                ...augConfig.imageMaskChannels,
                imgChannels: augConfig.imageMaskChannels!.imgChannels,
                maskChannels: parseInt(e.target.value),
              })
            }
          >
            <option value={1}>1 - Binary/Grayscale</option>
            <option value={3}>3 - RGB</option>
          </Select>
        </InputGroup>
      </Stack>
    </FormControl>
  );
};

export default ImageMaskChannelInput;
