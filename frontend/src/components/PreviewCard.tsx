import { HStack } from "@chakra-ui/react";
import { Metadata } from "../entities/UploadedImageMask";
import ImageCard from "./ImageCard";

interface Props {
  image: Metadata;
  mask: Metadata;
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
