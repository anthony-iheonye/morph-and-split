import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { IoMdSettings } from "react-icons/io";
import { Link } from "react-router-dom";
import useActiveParent from "../hooks/useActiveParent";
import useNavIconColor from "../hooks/useNavIconColor";
import { parentNames } from "../store/navStore";
import useActiveNavColor from "../hooks/useActiveParentColor";

const AugmentationConfigIcon = () => {
  const backgroundColor = useNavIconColor();
  const { activeParent, setActiveParent } = useActiveParent();
  const parentName = parentNames.augmentationConfig;
  const { parentColor } = useActiveNavColor();

  return (
    <Box width="auto" alignSelf="center">
      <Link to={"/settings"} onClick={() => setActiveParent(parentName)}>
        <Tooltip label="Augmentation settings" placement="top-start">
          <IconButton
            aria-label="Upload Image and segmentation mask"
            icon={<IoMdSettings />}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={backgroundColor}
            backgroundColor={
              activeParent === parentName ? parentColor : "transparent"
            }
          />
        </Tooltip>
      </Link>
    </Box>
  );
};

export default AugmentationConfigIcon;
