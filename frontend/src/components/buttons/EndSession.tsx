import { Button, useBreakpointValue, useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useAugConfigAndSetter, useBackendResponse } from "../../hooks";
import { handleEndSession } from "../../services";

interface Props {
  label?: string | { base?: string; md?: string; lg?: string };
  disable?: boolean;
}

const EndSession = ({ label = "End session", disable = false }: Props) => {
  const responsiveLabel = useBreakpointValue(
    typeof label === "string" ? { base: label } : label
  );
  const { resetAugConfig } = useAugConfigAndSetter();
  const { resetBackendResponseLog } = useBackendResponse();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <Button
      colorScheme="red"
      size="sm"
      borderRadius={20}
      leftIcon={<AiOutlineCloseSquare />}
      isDisabled={disable}
      onClick={() =>
        handleEndSession({
          resetAugConfig,
          resetBackendResponseLog,
          queryClient,
          toast,
          navigate,
        })
      }
    >
      {responsiveLabel}
    </Button>
  );
};

export default EndSession;
