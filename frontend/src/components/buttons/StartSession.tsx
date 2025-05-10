import {
  Button,
  Spinner,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaPowerOff } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { BackendResponse, CustomError } from "../../entities";
import { useSessionIsRunning } from "../../hooks";
import { APIClient } from "../../services";
import invalidateQueries from "../../services/invalidateQueries";

/**
 * Props for the StartSession component.
 */
interface Props {
  /** Label for the button. Can be a string or a responsive object. */
  label?: string | { base?: string; md?: string; lg?: string };
  /** Path to navigate to once the session has been successfully started. */
  to: string;
  /** Whether the button should be disabled. Default is false. */
  disable?: boolean;
}

/**
 * StartSession component displays a button to initialize a new session.
 *
 * Upon clicking, it performs the following steps:
 * - Creates a Google Cloud Storage (GCS) bucket
 * - Creates directories within that bucket
 * - Creates backend project directories
 * - Marks the session as running on the backend
 * - Navigates the user to the given path if successful
 *
 * Displays appropriate loading and success/failure indicators with toast notifications.
 */
const StartSession = ({
  to,
  label = "Start a Session",
  disable = false,
}: Props) => {
  const GCSClient = new APIClient<BackendResponse>("/gcs/create_bucket");
  const bucketDirectoryClient = new APIClient<BackendResponse>(
    "/gcs/create_folders_in_bucket"
  );
  const projectDirectoryClient = new APIClient<BackendResponse>(
    "project_directories/create"
  );
  const sessionClient = new APIClient<BackendResponse>(
    "/session/start_session"
  );

  const { data: session } = useSessionIsRunning();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  /** Resolves label text based on current screen size */
  const responsiveLabel = useBreakpointValue(
    typeof label === "string" ? { base: label } : label
  );

  /**
   * Handles the button click to initiate the session setup process.
   */
  const handleClick = async () => {
    try {
      setIsLoading(true);

      const bucketCreation = await GCSClient.executeAction();
      if (!bucketCreation.success) {
        throw new CustomError(
          "GCS Bucket Creation",
          "Google Cloud credit is exhausted. Please, load more credit." // Failed to create a Google Cloud Storage bucket
        );
      }

      const directoryCreation = await bucketDirectoryClient.executeAction();
      if (!directoryCreation.success) {
        throw new CustomError(
          "Bucket Directory Creation",
          "Failed to create directories within the GCS bucket."
        );
      }

      const projectDirectoryCreation =
        await projectDirectoryClient.executeAction();
      if (!projectDirectoryCreation.success) {
        throw new CustomError(
          "Project Directory Creation",
          "Failed to create backend project directories."
        );
      }

      const session = await sessionClient.executeAction();
      if (!session.isRunning) {
        throw new CustomError("Session State", "Failed to start new session.");
      } else {
        navigate(to);
        invalidateQueries(queryClient, [
          "backendIsRunning",
          "sessionIsRunning",
        ]);
      }
    } catch (error: any) {
      toast({
        title: error.title || "Failed to Start Session",
        description: error.message || "An unexpected error occurred.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      colorScheme="teal"
      size="sm"
      onClick={() => handleClick()}
      borderRadius={20}
      leftIcon={
        isLoading ? (
          <Spinner color="blacks" />
        ) : session?.isRunning ? (
          <FaCircleCheck size="1rem" />
        ) : (
          <FaPowerOff size="1rem" />
        )
      }
      isDisabled={disable || session?.isRunning}
    >
      {isLoading
        ? "Setting up workspace..."
        : session?.isRunning
        ? "Session active"
        : responsiveLabel}
    </Button>
  );
};

export default StartSession;
