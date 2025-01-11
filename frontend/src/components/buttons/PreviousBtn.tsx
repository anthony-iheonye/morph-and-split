import { Button, useBreakpointValue } from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface Props {
  label?: string | { base?: string; md?: string; lg?: string };
  to: string;
  disable?: boolean;
}

const PreviousBtn = ({ to, label = "Previous", disable = false }: Props) => {
  const navigate = useNavigate();

  const responsiveLabel = useBreakpointValue(
    typeof label === "string" ? { base: label } : label
  );

  return (
    <Button
      colorScheme="teal"
      size="sm"
      onClick={() => navigate(to)}
      borderRadius={20}
      leftIcon={<IoIosArrowBack />}
      isDisabled={disable}
    >
      {responsiveLabel}
    </Button>
  );
};

export default PreviousBtn;
