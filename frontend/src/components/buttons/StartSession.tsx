import { Button, useBreakpointValue, useToast } from "@chakra-ui/react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { APIClient } from "../../services";
import { BackendResponse, CustomError } from "../../entities";

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
  const GCSClient = new APIClient<BackendResponse>("/gcs/create_bucket");
  const projectDirectoryClient = new APIClient<BackendResponse>(
    "project_directories/create"
  );

  const responsiveLabel = useBreakpointValue(
    typeof label === "string" ? { base: label } : label
  );

  const toast = useToast();

  const handleClick = async () => {
    try {
      // Create a new bucket
      const bucketCreation = await GCSClient.executeAction();

      if (!bucketCreation.success) {
        throw new CustomError(
          "GCS Bucket Creation",
          "Failed to create a Google Cloud Storage bucket."
        );
      }

      const projectDirectoryCreation =
        await projectDirectoryClient.executeAction();

      if (!projectDirectoryCreation.success) {
        throw new CustomError(
          "Project Directory Creation",
          "Failed to create backend project directories."
        );
      } else {
        navigate(to);
      }
    } catch (error: any) {
      toast({
        title: error.title || "Unexpected Error",
        description: error.message || "An unexpected error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
