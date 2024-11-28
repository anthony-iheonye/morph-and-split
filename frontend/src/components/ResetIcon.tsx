import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { VscDebugRestart } from "react-icons/vsc";
import useNavIconColor from "../hooks/useNavIconColor";
import useAugConfigStore from "../store/augConfigStore";

const ResetIcon = () => {
  const backgroundColor = useNavIconColor();
  const resetAugConfig = useAugConfigStore((state) => state.resetAugConfig);

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
          onClick={() => resetAugConfig()}
        />
      </Tooltip>
    </Box>
  );
};

export default ResetIcon;
