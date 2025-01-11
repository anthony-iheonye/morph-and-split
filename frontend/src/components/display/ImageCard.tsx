import { Card, CardBody, Image, Text } from "@chakra-ui/react";
import { Metadata } from "../../entities";

interface Props {
  file: Metadata;
}

const ImageCard = ({ file }: Props) => {
  return (
    <Card borderRadius={0}>
      <Image src={file.url} objectFit="contain" />
      <CardBody paddingTop={1} paddingBottom={1}>
        <Text color="gray" fontSize="small" overflowWrap="normal">
          {file.name}
        </Text>
      </CardBody>
    </Card>
  );
};

export default ImageCard;
