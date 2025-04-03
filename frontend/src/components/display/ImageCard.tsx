import { Card, CardBody, Image } from "@chakra-ui/react";
import { Metadata } from "../../entities";
import { ThemedText } from "../miscellaneous";

/**
 * Props for the ImageCard component.
 */
interface Props {
  /** Metadata object containing the image URL and name. */
  file: Metadata;
}

/**
 * ImageCard is a styled component that displays an image and its associated filename.
 *
 * It uses Chakra UI's Card layout and a ThemedText component for caption rendering,
 * supporting both light and dark modes.
 */
const ImageCard = ({ file }: Props) => {
  return (
    <Card borderRadius={0}>
      <Image src={file.url} objectFit="cover" />
      <CardBody paddingTop={1} paddingBottom={1}>
        <ThemedText
          lightModeTextColor="gray.600"
          darkModeTextColor="gray.500"
          fontSize="small"
          overflowWrap="normal"
        >
          {file.name}
        </ThemedText>
      </CardBody>
    </Card>
  );
};

export default ImageCard;
