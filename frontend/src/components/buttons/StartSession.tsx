import { Button, useBreakpointValue } from "@chakra-ui/react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { APIClient } from "../../services";
import { BackendResponse } from "../../entities";

interface Props {
  label?: string | { base?: string; md?: string; lg?: string };
  to: string;
  disable?: boolean;
}

const StartSession = ({
  to,
  label = "Start a Session",
  disable = false,
}: Props) => {
  const navigate = useNavigate();
  const storageClient = new APIClient<BackendResponse>("/gcs/create_bucket");

  const responsiveLabel = useBreakpointValue(
    typeof label === "string" ? { base: label } : label
  );

  const handleClick = async () => {
    try {
      const response = await storageClient.executeAction();

      if (response.success) {
        navigate(to);
      }
    } catch (err) {}
  };

  return (
    <Button
      colorScheme="teal"
      size="sm"
      onClick={() => handleClick()}
      borderRadius={20}
      rightIcon={<IoIosArrowForward />}
      isDisabled={disable}
    >
      {responsiveLabel}
    </Button>
  );
};

export default StartSession;
