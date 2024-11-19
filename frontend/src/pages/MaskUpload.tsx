import { Box, HStack, Text } from "@chakra-ui/react";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoLayers } from "react-icons/io5";
import { TbLayersSelected } from "react-icons/tb";
import BoundingBox from "../components/BoundingBox";
import IconHeadingDescriptionCombo from "../components/IconHeadingDescriptionCombo";
import ImageChannel from "../components/ImageChannel";
import MaskSelector from "../components/MaskSelector";
import useAugConfigAndSetter from "../hooks/useAugConfigAndSetter";
import MaskChannel from "../components/MaskChannel";

const MaskUpload = () => {
  const { augConfig } = useAugConfigAndSetter();
  const masks = augConfig.masks;

  return (
    <>
      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={BiSolidImageAdd}
            title="Select Segmentation Masks"
            description="Click button to select masks for augmentation."
          />
          <MaskSelector />
        </HStack>
      </BoundingBox>
      <BoundingBox>
        <HStack justify="space-between" align="start" width="100%">
          <IconHeadingDescriptionCombo
            icon={IoLayers}
            title="Number of Mask Channels"
            description="Select the number of mask channels from the dropdown list."
          />
          <MaskChannel />
        </HStack>
      </BoundingBox>
      <BoundingBox>
        <IconHeadingDescriptionCombo
          icon={TbLayersSelected}
          title="Selected Masks"
        />
        <Box overflowY="auto" maxHeight="400px" mt={4}>
          {masks && masks?.length > 0 ? (
            masks?.map((mask) => (
              <Text fontWeight="thin" fontSize="md" key={mask.id}>
                {mask.name}
              </Text>
            ))
          ) : (
            <Text color="red" fontWeight="thin" fontSize="md">
              Ready to get started? Select the corresponding masks.
            </Text>
          )}
        </Box>
      </BoundingBox>
    </>
  );
};

export default MaskUpload;
