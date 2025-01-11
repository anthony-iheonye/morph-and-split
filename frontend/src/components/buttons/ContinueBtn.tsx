import { Button } from "@chakra-ui/react";
import { IoIosArrowForward } from "react-icons/io";

interface Props {
  label: string;
  setContinue: () => void;
}

const ContinueBtn = ({ label, setContinue }: Props) => {
  return (
    <Button
      colorScheme="teal"
      size="sm"
      onClick={setContinue}
      borderRadius={20}
      rightIcon={<IoIosArrowForward />}
    >
      {label}
    </Button>
  );
};

export default ContinueBtn;
