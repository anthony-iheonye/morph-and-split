import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { QueryClient } from "@tanstack/react-query";
import { AugConfig, BackendResponseLog } from "../store";
import APIClient from "./api-client";
import invalidateQueries from "./invalidateQueries";

interface Props {
  queryClient: QueryClient;
  toast: (options: UseToastOptions) => ToastId;
  setBackendResponseLog: <K extends keyof BackendResponseLog>(
    key: K,
    value: BackendResponseLog[K]
  ) => void;
  setAugConfig: <K extends keyof AugConfig>(
    key: K,
    value: AugConfig[K]
  ) => void;
}

/**
 * Handles deletion of the uploaded stratification data file.
 *
 * Workflow:
 * 1. Sends a DELETE request to remove the stratification file from the backend.
 * 2. Updates state flags and resets the selected split parameter.
 * 3. Invalidates related queries to refresh UI state.
 * 4. Displays success or error notifications via toast.
 *
 * @param queryClient - React Query client for cache invalidation.
 * @param toast - Chakra UI toast function for user notifications.
 * @param setBackendResponseLog - Zustand state updater for backend flags.
 * @param setAugConfig - Zustand updater for AugConfig to clear splitParameter.
 */
const handleDeleteStratDataFile = async ({
  queryClient,
  toast,
  setBackendResponseLog,
  setAugConfig,
}: Props) => {
  const deleteStratificationFileClient = new APIClient(
    "/stratification_data_file/delete"
  );

  try {
    setBackendResponseLog("deletingStratDataFile", true);

    // Step 1: Attempt to delete the stratification file from backend
    const response =
      await deleteStratificationFileClient.deleteFileOrDirectory();

    if (!response.success) {
      toast({
        title: response.error,
        description: response.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      // Step 2: Invalidate related queries so UI updates with no file
      invalidateQueries(queryClient, [
        "stratificationFileName",
        "strafied_split_parameters",
      ]);
    }
  } catch (error: any) {
    // Step 3: Handle backend or network errors
    const errorTitle = error.response?.data?.error || "Delete Error";
    const errorDescription =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    toast({
      title: errorTitle,
      description: errorDescription,
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  } finally {
    // Step 4: Reset state flags and clear selected split parameter
    setBackendResponseLog("deletingStratDataFile", false);
    setAugConfig("splitParameter", "");
  }
};

export default handleDeleteStratDataFile;
