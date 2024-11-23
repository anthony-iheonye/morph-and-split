import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { TbTransformFilled } from "react-icons/tb";
import useNavIconColor from "../hooks/useNavIconColor";
import { Link } from "react-router-dom";

const AugmentIcon = () => {
  const backgroundColor = useNavIconColor();

  return (
    <Box width="auto" alignSelf="center">
      <Link to={"/augment"}>
        <Tooltip label="Initiate Augmentation" placement="top-start">
          <IconButton
            aria-label="Upload Image and segmentation mask"
            icon={<TbTransformFilled />}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={backgroundColor}
          />
        </Tooltip>
      </Link>
    </Box>
  );
};

export default AugmentIcon;
