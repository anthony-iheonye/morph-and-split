import { Button } from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface Props {
  label?: string;
  to: string;
  disable?: boolean;
}

const PreviousBtn = ({ to, label = "Previous", disable = false }: Props) => {
  const navigate = useNavigate();

  return (
    <Button
      colorScheme="teal"
      size="sm"
      onClick={() => navigate(to)}
      borderRadius={20}
      leftIcon={<IoIosArrowBack />}
      isDisabled={disable}
    >
      {label}
    </Button>
  );
};

export default PreviousBtn;
