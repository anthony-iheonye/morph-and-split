import {
  Button,
  ResponsiveValue,
  Spinner,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { FaPowerOff } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAugConfigAndSetter, useBackendResponse } from "../../hooks";
import { handleEndSession } from "../../services";

interface Props {
  label?: string | { base?: string; md?: string; lg?: string };
  disable?: boolean;
  size?: ResponsiveValue<"md" | "lg" | (string & {}) | "sm" | "xs"> | undefined;
}

const EndSession = ({
  label = "End session",
  size,
  disable = false,
}: Props) => {
  const responsiveLabel = useBreakpointValue(
    typeof label === "string" ? { base: label } : label
  );
  const { resetAugConfig } = useAugConfigAndSetter();
  const { resetBackendResponseLog, isShuttingDown, setBackendResponseLog } =
    useBackendResponse();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <Button
      colorScheme="red"
      size={size}
      borderRadius={20}
      leftIcon={
        isShuttingDown ? <Spinner size={size} /> : <FaPowerOff size="1rem" />
      }
      isDisabled={disable}
      onClick={() =>
        handleEndSession({
          resetAugConfig,
          resetBackendResponseLog,
          setBackendResponseLog,
          queryClient,
          toast,
          navigate,
        })
      }
    >
      {isShuttingDown ? "Shutting down ..." : responsiveLabel}
    </Button>
  );
};

export default EndSession;
