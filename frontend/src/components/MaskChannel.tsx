import { InputGroup, Select } from "@chakra-ui/react";
import useAugConfigAndSetter from "../hooks/useAugConfigAndSetter";

const MaskChannel = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <InputGroup size="sm" width="auto" borderRadius="10px">
      <Select
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
  );
};

export default MaskChannel;
