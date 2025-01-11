import { Button } from "@chakra-ui/react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface Props {
  label?: string;
  to: string;
  disable?: boolean;
}

const ContinueBtn = ({ to, label = "Continue", disable = false }: Props) => {
  const navigate = useNavigate();

  return (
    <Button
      colorScheme="teal"
      size="sm"
      onClick={() => navigate(to)}
      borderRadius={20}
      rightIcon={<IoIosArrowForward />}
      isDisabled={disable}
    >
      {label}
    </Button>
  );
};

export default ContinueBtn;
