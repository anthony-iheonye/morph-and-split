import { Select } from "@chakra-ui/react";
import { useAugConfigAndSetter } from "../../hooks";

const ImageChannel = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <Select
      width="auto"
      size={{ base: "sm", md: "md" }}
      borderRadius={6}
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
  );
};

export default ImageChannel;
