import { Card, CardBody, Image } from "@chakra-ui/react";
import { Metadata } from "../../entities";
import { ThemedText } from "../miscellaneous";

interface Props {
  file: Metadata;
}

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
