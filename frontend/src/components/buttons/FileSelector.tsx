import { Button, Icon, Input } from "@chakra-ui/react";
import { BsImages } from "react-icons/bs";

interface Props {
  label: string;
}

const FileSelector = ({ label }: Props) => {
  return (
    <Button
      leftIcon={<Icon as={BsImages} />}
      as="label"
      variant="outline"
      cursor="pointer"
      padding={2}
    >
      {label}
      <Input
        type="file"
        multiple
        variant="outline"
        padding="0"
        display="None"
        accept={"image/png, image/jpeg, image/jpg"}
      />
    </Button>
  );
};

export default FileSelector;
