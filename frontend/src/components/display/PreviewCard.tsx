import { HStack } from "@chakra-ui/react";
import { Metadata } from "../../entities";
import ImageCard from "./ImageCard";

/**
 * Props for the PreviewCard component.
 */
interface Props {
  /** Metadata for the image file. */
  image: Metadata;
  /** Metadata for the corresponding mask file. */
  mask: Metadata;
}

/**
 * PreviewCard displays a horizontal stack of two ImageCards:
 * one for the original image and one for its associated mask.
 *
 * Useful for previewing image-mask pairs side-by-side in data annotation workflows.
 */
const PreviewCard = ({ image, mask }: Props) => {
  return (
    <HStack spacing={0}>
      <ImageCard file={image} />
      <ImageCard file={mask} />
    </HStack>
  );
};

export default PreviewCard;
