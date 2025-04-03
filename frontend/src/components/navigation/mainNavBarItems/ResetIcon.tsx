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
  Spinner,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { GrPowerShutdown } from "react-icons/gr";
import { VscDebugRestart } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { BackendResponse, CustomError } from "../../../entities";
import {
  useAugConfigAndSetter,
  useBackendResponse,
  useIsBackendRunning,
  useNavIconColor,
} from "../../../hooks";
import { APIClient, handleEndSession } from "../../../services";
import invalidateQueries from "../../../services/invalidateQueries";
import { IconButtonWithToolTip } from "../../buttons";

/**
 * ResetIcon component is used for handling session reset and termination.
 * It triggers session reset operations, displays a confirmation dialog,
 * and manages the state and effects related to the reset process.
 */
const ResetIcon = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { augConfig, setAugConfig, resetAugConfig } = useAugConfigAndSetter();
  const {
    resetBackendResponseLog,
    augmentationIsRunning,
    isResetting,
    isShuttingDown,
    setBackendResponseLog,
    imageIsUploading,
    maskIsUploading,
  } = useBackendResponse();

  const toast = useToast();
  const backgroundColor = useNavIconColor();

  // Query client for resetting queries
  const queryClient = useQueryClient();
  const { data } = useIsBackendRunning();
  const navigate = useNavigate();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Create API clients for resetting data and configurations
  const GCSDeleteClient = new APIClient<BackendResponse>("/gcs/delete_bucket");
  const GCSCreateClient = new APIClient<BackendResponse>("/gcs/create_bucket");
  const projectDirectoryClient = new APIClient<BackendResponse>(
    "project_directories/create"
  );
  const signedUrlsClient = new APIClient<BackendResponse>(
    "/reset-all-signed-download-urls"
  );

  /**
   * handleReset is responsible for performing the session reset operations.
   * It interacts with the backend to delete and create resources (e.g., GCS bucket, directories)
   * and resets the necessary queries and configurations.
   *
   * Side Effects:
   * - Deletes and creates GCS buckets
   * - Creates project directories
   * - Resets signed download URLs
   * - Resets local configuration and backend response states
   * - Invalidates queries to refresh data
   * - Navigates to the image upload page after success
   */
  const handleReset = async (key: keyof typeof augConfig) => {
    try {
      // Indicate reset is in progress by setting isResetting to true
      setBackendResponseLog("isResetting", true);

      // Step 1: Delete existing GCS bucket
      const gcsBucketDeletion = await GCSDeleteClient.deleteFileOrDirectory();
      if (!gcsBucketDeletion) {
        throw new CustomError(
          "GCS Storage Deletion Failed.",
          "Failed to delete Google Cloud Storage bucket."
        );
      }

      // Step 2: Create new GCS bucket
      const gcsBucketCreation = await GCSCreateClient.executeAction();
      if (!gcsBucketCreation.success) {
        throw new CustomError(
          "GCS Bucket Creation",
          "Failed to create Google Cloud Storage bucket."
        );
      }

      // Step 3: Create new backend project directories
      const projectDirectoryCreation =
        await projectDirectoryClient.executeAction();
      if (!projectDirectoryCreation.success) {
        throw new CustomError(
          "Project Directory Creation Failed.",
          "Failed to create project directories."
        );
      }

      // Step 4: Reset signed download URLs
      const resetSignedDownloadUrls = await signedUrlsClient.executeAction();
      if (!resetSignedDownloadUrls.success) {
        throw new CustomError(
          "Resetting Signed Download URLs",
          "Failed to reset signed download URLs."
        );
      } else {
        // Show success toast once the reset is successful
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

        // Reset queries to refresh the session's data state
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
          "stratificationFileName",
          "stratified_split_parameters",
        ]);

        // Navigate to the upload data page after the reset
        navigate("/upload_data/images");
      }
    } catch (error) {
      // Show error toast if the reset operation fails
      toast({
        title: "Failed to reset session",
        description: "An unknown error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      // Indicate reset process is complete by setting isResetting to false
      setBackendResponseLog("isResetting", false);
    }
  };

  // Handles the reset confirmation button click
  const confirmReset = () => {
    handleReset("reset");
    onClose();
  };

  // Handles the end session confirmation button click
  const confirmEndSession = () => {
    handleEndSession({
      resetAugConfig,
      resetBackendResponseLog,
      setBackendResponseLog,
      queryClient,
      toast,
      navigate,
    });
    onClose();
  };

  return (
    <>
      <Box width="auto" alignSelf="center">
        <Tooltip label="Reset/End Session" placement="top-start">
          <IconButton
            aria-label="Upload Image and segmentation mask"
            icon={
              isResetting || isShuttingDown ? (
                <Spinner size="md" color="teal" />
              ) : (
                <VscDebugRestart />
              )
            }
            variant="ghost"
            size="lg"
            fontSize="1.5rem"
            colorScheme={backgroundColor}
            onClick={onOpen}
            disabled={
              !data?.success ||
              augmentationIsRunning ||
              isShuttingDown ||
              imageIsUploading ||
              maskIsUploading
            }
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
              <Button colorScheme="red" onClick={confirmReset} ml={3} mr={1}>
                Reset
              </Button>

              <IconButtonWithToolTip
                tooltipLabel="End Session"
                aria-label="Click to end current session"
                icon={<GrPowerShutdown />}
                onClick={confirmEndSession}
                isDisabled={isShuttingDown}
              />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ResetIcon;
