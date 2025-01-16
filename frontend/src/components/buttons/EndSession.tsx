import { Button, useBreakpointValue } from "@chakra-ui/react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { APIClient } from "../../services";
import { BackendResponse } from "../../entities";
import { useNavigate } from "react-router-dom";

interface Props {
  label?: string | { base?: string; md?: string; lg?: string };
  disable?: boolean;
}

const EndSession = ({ label = "End session", disable = false }: Props) => {
  const responsiveLabel = useBreakpointValue(
    typeof label === "string" ? { base: label } : label
  );

  const sessionClient = new APIClient<BackendResponse>("/delete_session");
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const response = await sessionClient.endSession();

      if (response.success) {
        navigate("/");
      }
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  };

  return (
    <Button
      colorScheme="red"
      size="sm"
      borderRadius={20}
      leftIcon={<AiOutlineCloseSquare />}
      isDisabled={disable}
      onClick={() => handleClick()}
    >
      {responsiveLabel}
    </Button>
  );
};

export default EndSession;
