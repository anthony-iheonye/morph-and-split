import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  IconButton,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import {
  useAugConfigAndSetter,
  useBackendResponse,
  useIsBackendRunning,
  useNavIconColor,
} from "../../../hooks";
import { APIClient } from "../../../services";
import invalidateQueries from "../../../services/invalidateQueries";
import { BackendResponse, CustomError } from "../../../entities";
import { useNavigate } from "react-router-dom";

const ResetIcon = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { augConfig, setAugConfig, resetAugConfig } = useAugConfigAndSetter();
  const { resetBackendResponseLog } = useBackendResponse();

  const toast = useToast();
  const backgroundColor = useNavIconColor();
  // Query client for reseting queries
  const queryClient = useQueryClient();
  const { data } = useIsBackendRunning();

  const navigate = useNavigate();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Create API clients
  const projectDirectoryClient = new APIClient<BackendResponse>(
    "project_directories/create"
  );
  const GCSDeleteClient = new APIClient<BackendResponse>("/gcs/delete_bucket");
  const GCSCreateClient = new APIClient<BackendResponse>("/gcs/create_bucket");

  const handleReset = async (key: keyof typeof augConfig) => {
    try {
      // Create new project directories
      const projectDirectoryCreation =
        await projectDirectoryClient.executeAction();

      if (!projectDirectoryCreation.success) {
        throw new CustomError(
          "Project Directory Creation Failed.",
          "Failed to create project directories."
        );
      }

      const gcsBucketDeletion = await GCSDeleteClient.deleteDirectory();
      if (!gcsBucketDeletion) {
        throw new CustomError(
          "GCS Storage Deletion  Failed.",
          "Failed to delete Google Cloud Storage bucket."
        );
      }

      const gcsBucketCreation = await GCSCreateClient.executeAction();
      if (!gcsBucketCreation.success) {
        throw new CustomError(
          "GCS Bucket Creation",
          "Failed to create Google Cloud Storage bucket."
        );
      } else {
        toast({
          title: "Session reset successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Reset local configurations
        resetAugConfig();
        resetBackendResponseLog();
        setAugConfig(key, !augConfig[key]);

        // Reset queries.
        invalidateQueries(queryClient, [
          "imageNames",
          "maskNames",
          "metadata",
          "augmentationIsComplete",
          "imageUploadStatus",
          "maskUploadStatus",
          "trainingSet",
          "validationSet",
          "testingSet",
        ]);

        navigate("/upload_data/images");
      }
    } catch (error) {
      toast({
        title: "Failed to reset session",
        description: "An unknown error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const confirmReset = () => {
    handleReset("reset");
    onClose();
  };

  return (
    <>
      <Box width="auto" alignSelf="center">
        <Tooltip label="Reset Session" placement="top-start">
          <IconButton
            aria-label="Upload Image and segmentation mask"
            icon={<VscDebugRestart />}
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={backgroundColor}
            onClick={onOpen}
            disabled={!data?.success}
          />
        </Tooltip>
      </Box>

      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        motionPreset="slideInTop"
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Reset
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to reset the session? All settings will
              revert to their defaults, and any uploaded images and masks will
              be permanently deleted. This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmReset} ml={3}>
                Reset
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ResetIcon;
