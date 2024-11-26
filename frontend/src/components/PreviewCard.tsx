import { HStack } from "@chakra-ui/react";
import AugImage from "../entities/AugImage";
import AugMask from "../entities/AugMask";
import ImageCard from "./ImageCard";

interface Props {
  image: AugImage;
  mask: AugMask;
}

const PreviewCard = ({ image, mask }: Props) => {
  return (
    <HStack spacing={0}>
      <ImageCard file={image} />
      <ImageCard file={mask} />
    </HStack>
  );
};

export default PreviewCard;
