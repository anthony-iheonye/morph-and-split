import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { NavigateFunction } from "react-router-dom";
import { BackendResponse, CustomError } from "../entities";
import APIClient from "./api-client";
import invalidateQueries from "./invalidateQueries";
import { QueryClient } from "@tanstack/react-query";
import { BackendResponseLog } from "../store";

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

  try {
    setBackendResponseLog("isShuttingDown", true);
    const gcsBucketDeletion = await GCSClient.deleteDirectory();

    if (!gcsBucketDeletion.success) {
      throw new CustomError(
        "Bucket Deletion Failed",
        "Failed to delete Google Cloud Storage Bucket"
      );
    }

    const projectDirectoryDeletion =
      await projectDirectoryClient.deleteDirectory();

    if (!projectDirectoryDeletion.success) {
      throw new CustomError(
        "Project Directory Deletion Failed",
        "Failed to delete project directories."
      );
    } else {
      // Reset local configurations
      resetAugConfig();
      resetBackendResponseLog();

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
