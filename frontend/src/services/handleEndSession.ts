import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { QueryClient } from "@tanstack/react-query";
import { NavigateFunction } from "react-router-dom";
import { BackendResponse, CustomError } from "../entities";
import { BackendResponseLog } from "../store";
import APIClient from "./api-client";
import invalidateQueries from "./invalidateQueries";

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
  const resetUploadedDataURLClient = new APIClient<BackendResponse>(
    "reset-signed-urls-for-resized-images-and-masks"
  );
  const resetTrainSetURLClient = new APIClient<BackendResponse>(
    "/reset-signed-urls-for-resized-train-set"
  );
  const resetValSetURLClient = new APIClient<BackendResponse>(
    "/reset-signed-urls-for-resized-validation-set"
  );
  const resetTestSetURLClient = new APIClient<BackendResponse>(
    "/reset-signed-urls-for-resized-test-set"
  );

  const deleteStratificationFileClient = new APIClient(
    "/stratification_data_file/delete"
  );

  const resetGlobalBucketVariableClient = new APIClient(
    "/gcs/reset_global_buckets_variables"
  );

  const sessionClient = new APIClient<BackendResponse>("/session/stop_session");

  try {
    setBackendResponseLog("isShuttingDown", true);
    const gcsBucketDeletion = await GCSClient.deleteFileOrDirectory();

    if (!gcsBucketDeletion.success) {
      throw new CustomError(
        "Bucket Deletion Failed",
        "Failed to delete Google Cloud Storage Bucket"
      );
    }

    const resetBucketVariables =
      await resetGlobalBucketVariableClient.executeAction();
    if (!resetBucketVariables.success) {
      throw new CustomError(
        "Resetting Global Bucket Variables",
        "Failed to reset global bucket variables."
      );
    }

    const resetUploadedDataSignedUrls =
      await resetUploadedDataURLClient.executeAction();
    if (!resetUploadedDataSignedUrls.success) {
      throw new CustomError(
        "Resetting signed URLs",
        "Failed to reset signed urls for resized images and mask."
      );
    }

    const resetTrainSetSignedUrls =
      await resetTrainSetURLClient.executeAction();
    if (!resetTrainSetSignedUrls.success) {
      throw new CustomError(
        "Resetting Training Set Signed URLs",
        "Failed to reset signed urls for training set."
      );
    }

    const resetValSetSignedUrls = await resetValSetURLClient.executeAction();
    if (!resetValSetSignedUrls.success) {
      throw new CustomError(
        "Resetting Validation Set Signed URLs",
        "Failed to reset signed urls for validation set."
      );
    }

    const resetTestSetSignedUrls = await resetTestSetURLClient.executeAction();
    if (!resetTestSetSignedUrls.success) {
      throw new CustomError(
        "Resetting Testing Set Signed URLs",
        "Failed to reset signed urls for testing set."
      );
    }

    // Delete stratification data file from backend storage
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

    const projectDirectoryDeletion =
      await projectDirectoryClient.deleteFileOrDirectory();

    if (!projectDirectoryDeletion.success) {
      throw new CustomError(
        "Project Directory Deletion Failed",
        "Failed to delete project directories."
      );
    }

    // Mark session as 'started'
    const session = await sessionClient.executeAction();
    if (session.isRunning) {
      throw new CustomError("Session State", "Failed to stop current session.");
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
