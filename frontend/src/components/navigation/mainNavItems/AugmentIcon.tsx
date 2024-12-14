import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { TbTransformFilled } from "react-icons/tb";
import useNavIconColor from "../../../hooks/useNavIconColor";
import { Link } from "react-router-dom";
import useActiveParent from "../../../hooks/useActiveParent";
import useActiveNavColor from "../../../hooks/useActiveNavColor";
import { parentNames } from "../../../store/navStore";

const AugmentIcon = () => {
  const backgroundColor = useNavIconColor();
  const { activeParent, setActiveParent } = useActiveParent();
  const parentName = parentNames.augment;
  const { parentColor } = useActiveNavColor();

  return (
    <Box width="auto" alignSelf="center">
      <Link to={"/augment"} onClick={() => setActiveParent(parentName)}>
        <Tooltip label="Initiate Augmentation" placement="top-start">
          <IconButton
            aria-label="Upload Image and segmentation mask"
            icon={<TbTransformFilled />}
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

export default AugmentIcon;
