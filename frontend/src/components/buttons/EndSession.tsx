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

/**
 * Props for the EndSession button component.
 */
interface Props {
  /** Button label text, optionally responsive across breakpoints. */
  label?: string | { base?: string; md?: string; lg?: string };
  /** Whether the button should be disabled. Default is false. */
  disable?: boolean;
  /** Responsive Chakra UI button size. */
  size?: ResponsiveValue<"md" | "lg" | (string & {}) | "sm" | "xs"> | undefined;
}

/**
 * EndSession component displays a button to terminate the current augmentation session.
 *
 * When clicked, it resets augmentation config, backend state, and clears the query cache.
 * The button shows a loading spinner if the backend is currently shutting down.
 */
const EndSession = ({
  label = "End session",
  size,
  disable = false,
}: Props) => {
  /** Resolves a responsive version of the label for display based on current breakpoint. */
  const responsiveLabel = useBreakpointValue(
    typeof label === "string" ? { base: label } : label
  );

  /** Hook to reset the augmentation configuration state. */
  const { resetAugConfig } = useAugConfigAndSetter();

  /** Backend-related state management hooks. */
  const { resetBackendResponseLog, isShuttingDown, setBackendResponseLog } =
    useBackendResponse();

  /** React Query's client instance for clearing cached queries. */
  const queryClient = useQueryClient();

  /** React Router hook to programmatically navigate between routes. */
  const navigate = useNavigate();

  /** Chakra UI hook for triggering user-facing toast notifications. */
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
