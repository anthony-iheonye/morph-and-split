import { InputGroup, Select } from "@chakra-ui/react";
import useAugConfigAndSetter from "../hooks/useAugConfigAndSetter";

const ImageChannel = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <InputGroup size="sm" width="auto" borderRadius="10px">
      <Select
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
  );
};

export default ImageChannel;
