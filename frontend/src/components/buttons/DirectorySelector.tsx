import { Button, Icon, Input } from "@chakra-ui/react";
import { BsFolder } from "react-icons/bs";

interface Props {
  label: string;
}

const DirectorySelector = ({ label }: Props) => {
  return (
    <Button
      leftIcon={<Icon as={BsFolder} />}
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
        webkitdirectory="true"
      />
    </Button>
  );
};

export default DirectorySelector;
