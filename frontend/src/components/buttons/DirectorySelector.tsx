import { Button, Icon, Input } from "@chakra-ui/react";
import { BsFolder } from "react-icons/bs";

interface Props {
  fileType: "image" | "mask";
}

const DirectorySelector = ({ fileType }: Props) => {
  return (
    <Button
      leftIcon={<Icon as={BsFolder} />}
      as="label"
      variant="outline"
      cursor="pointer"
      padding={2}
    >
      {`Select ${fileType} folder`}
      <Input
        type="file"
        multiple
        variant="outline"
        padding="0"
        display="None"
        accept={fileType + "/*"}
      />
    </Button>
  );
};

export default DirectorySelector;
