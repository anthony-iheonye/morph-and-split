import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { VscDebugRestart } from "react-icons/vsc";
import useAugConfigAndSetter from "../hooks/useAugConfigAndSetter";
import useNavIconColor from "../hooks/useNavIconColor";

const ResetIcon = () => {
  const backgroundColor = useNavIconColor();
  const { augConfig, setAugConfig, resetAugConfig } = useAugConfigAndSetter();

  const handleReset = (key: keyof typeof augConfig) => {
    resetAugConfig();
    setAugConfig(key, !augConfig[key]);
  };

  return (
    <Box width="auto" alignSelf="center">
      <Tooltip label="Reset All" placement="top-start">
        <IconButton
          aria-label="Upload Image and segmentation mask"
          icon={<VscDebugRestart />}
          variant="ghost"
          size="lg"
          fontSize="1.5rem"
          colorScheme={backgroundColor}
          onClick={() => handleReset("reset")}
        />
      </Tooltip>
    </Box>
  );
};

export default ResetIcon;
