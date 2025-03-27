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

    const gcsBucketDeletion = await GCSClient.deleteFileOrDirectory();

    if (!gcsBucketDeletion.success) {
      throw new CustomError(
        "Bucket Deletion Failed",
        "Failed to delete Google Cloud Storage Bucket"
      );
    }

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

    const deleteProjectDirectory =
      await projectDirectoryClient.deleteFileOrDirectory();

    if (!deleteProjectDirectory.success) {
      throw new CustomError(
        "Project Directory Deletion Failed",
        "Failed to delete project directories."
      );
    }

    const clearSession = await sessionClient.executeAction();
    if (!clearSession.success) {
      throw new CustomError(
        "Delete Session",
        "Failed to delete current session."
      );
    } else {
      // Reset local configurations
      resetAugConfig();
      resetBackendResponseLog();
      removeSessionId();
      navigate("/");

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
        "backendIsRunning",
        "stratificationFileName",
        "strafied_split_parameters",
        "sessionIsRunning",
      ]);
    }
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
