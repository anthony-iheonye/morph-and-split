import { Select } from "@chakra-ui/react";
import { useAugConfigAndSetter } from "../../hooks";

/**
 * MaskChannel is a select dropdown component for choosing the number of mask input channels.
 *
 * It updates the augmentation configuration's `imageMaskChannels.maskChannels` value.
 * Available options include:
 * - 1 (for Binary/Grayscale masks)
 * - 3 (for RGB masks)
 */
const MaskChannel = () => {
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  return (
    <Select
      size={{ base: "sm", md: "md" }}
      width="auto"
      borderRadius={6}
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
  );
};

export default MaskChannel;
