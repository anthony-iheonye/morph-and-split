import {
  Button,
  Spinner,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaPowerOff } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BackendResponse, CustomError } from "../../entities";
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
  const projectDirectoryClient = new APIClient<BackendResponse>(
    "project_directories/create"
  );

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

      // Create backend project directories
      const projectDirectoryCreation =
        await projectDirectoryClient.executeAction();

      if (!projectDirectoryCreation.success) {
        throw new CustomError(
          "Project Directory Creation",
          "Failed to create backend project directories."
        );
      } else {
        navigate(to);
        invalidateQueries(queryClient, ["backendIsRunning"]);
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
      leftIcon={isLoading ? <Spinner /> : <FaPowerOff size="1rem" />}
      isDisabled={disable}
    >
      {isLoading ? "Preparing work space..." : responsiveLabel}
    </Button>
  );
};

export default StartSession;
