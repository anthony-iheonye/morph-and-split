import { Button } from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";

interface Props {
  label: string;
  setPrevious: () => void;
}

const PreviousBtn = ({ label, setPrevious }: Props) => {
  return (
    <Button
      colorScheme="teal"
      size="sm"
      onClick={setPrevious}
      borderRadius={20}
      leftIcon={<IoIosArrowBack />}
    >
      {label}
    </Button>
  );
};

export default PreviousBtn;
