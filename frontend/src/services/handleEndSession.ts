import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { QueryClient } from "@tanstack/react-query";
import { NavigateFunction } from "react-router-dom";
import { BackendResponse, CustomError } from "../entities";
import { BackendResponseLog } from "../store";
import APIClient from "./api-client";
import invalidateQueries from "./invalidateQueries";
import { removeSessionId } from "./session";

interface Props {
  resetAugConfig: () => void;
  resetBackendResponseLog: () => void;
  setBackendResponseLog: <K extends keyof BackendResponseLog>(
    key: K,
    value: BackendResponseLog[K]
  ) => void;
  queryClient: QueryClient;
  toast: (options: UseToastOptions) => ToastId;
  navigate: NavigateFunction;
}

/**
 * Cleans up the current user session by:
 * - Deleting project directories and GCS bucket
 * - Deleting stratification file and backend session
 * - Clearing Zustand state and local session ID
 * - Navigating back to the home page
 * - Invalidating all related React Query caches
 *
 * Displays toasts for error handling and manages loading state during shutdown.
 *
 * @param resetAugConfig - Clears augmentation config in Zustand.
 * @param resetBackendResponseLog - Clears all backend response flags.
 * @param setBackendResponseLog - Updates "isShuttingDown" state flag.
 * @param queryClient - React Query client used for cache invalidation.
 * @param toast - Chakra UI toast for user feedback.
 * @param navigate - React Router navigation function.
 */
const handleEndSession = async ({
  resetAugConfig,
  resetBackendResponseLog,
  setBackendResponseLog,
  queryClient,
  toast,
  navigate,
}: Props): Promise<void> => {
  const GCSClient = new APIClient<BackendResponse>("/gcs/delete_bucket");
  const projectDirectoryClient = new APIClient<BackendResponse>(
    "/project_directories/delete"
  );
  const deleteStratificationFileClient = new APIClient(
    "/stratification_data_file/delete"
  );
  const sessionClient = new APIClient<BackendResponse>(
    "/session/clear_session"
  );

  try {
    setBackendResponseLog("isShuttingDown", true);

    // Step 1: Delete GCS bucket contents
    const gcsBucketDeletion = await GCSClient.deleteFileOrDirectory();
    if (!gcsBucketDeletion.success) {
      throw new CustomError(
        "Bucket Deletion Failed",
        "Failed to delete Google Cloud Storage Bucket"
      );
    }

    // Step 2: Delete stratification data file (optional)
    const deletedFile =
      await deleteStratificationFileClient.deleteFileOrDirectory();
    if (!deletedFile.success) {
      toast({
        title: deletedFile.error,
        description: deletedFile.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    // Step 3: Delete all project directories
    const deleteProjectDirectory =
      await projectDirectoryClient.deleteFileOrDirectory();
    if (!deleteProjectDirectory.success) {
      throw new CustomError(
        "Project Directory Deletion Failed",
        "Failed to delete project directories."
      );
    }

    // Step 4: Clear the backend session
    const clearSession = await sessionClient.executeAction();
    if (!clearSession.success) {
      throw new CustomError(
        "Delete Session",
        "Failed to delete current session."
      );
    }

    // Step 5: Reset frontend state and local storage
    resetAugConfig();
    resetBackendResponseLog();
    removeSessionId();
    navigate("/");

    // Step 6: Invalidate all relevant queries
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
      "backendIsRunning",
      "stratificationFileName",
      "strafied_split_parameters",
      "sessionIsRunning",
    ]);
  } catch (error: any) {
    toast({
      title: error.title || "Unexpected Error",
      description: error.message || "An unexpected error occurred.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  } finally {
    setBackendResponseLog("isShuttingDown", false);
  }
};

export default handleEndSession;
