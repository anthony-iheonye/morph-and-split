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

  const responsiveLabel = useBreakpointValue(
    typeof label === "string" ? { base: label } : label
  );

  const handleClick = async () => {
    try {
      setIsLoading(true);
      // Create a new bucket
      const bucketCreation = await GCSClient.executeAction();

      if (!bucketCreation.success) {
        throw new CustomError(
          "GCS Bucket Creation",
          "Failed to create a Google Cloud Storage bucket."
        );
      }

      // Create folders within the bucket
      const directoryCreation = await bucketDirectoryClient.executeAction();
      if (!directoryCreation.success) {
        throw new CustomError(
          "Bucket Directory Creation",
          "Failed to create directories within the GCS bucket."
        );
      }

      // Create backend project directories
      const projectDirectoryCreation =
        await projectDirectoryClient.executeAction();

      if (!projectDirectoryCreation.success) {
        throw new CustomError(
          "Project Directory Creation",
          "Failed to create backend project directories."
        );
      }

      // Mark session as 'started'
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
        duration: 3000,
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
