import { Card, CardBody, Image, Text } from "@chakra-ui/react";
import AugImage from "../entities/AugImage";
import AugMask from "../entities/AugMask";

interface Props {
  file: AugImage | AugMask;
}

const ImageCard = ({ file }: Props) => {
  return (
    <Card borderRadius={0}>
      <Image src={file.url} />
      <CardBody paddingTop={1} paddingBottom={1}>
        <Text color="gray" fontSize="small" overflowWrap="normal">
          {file.name}
        </Text>
      </CardBody>
    </Card>
  );
};

export default ImageCard;
