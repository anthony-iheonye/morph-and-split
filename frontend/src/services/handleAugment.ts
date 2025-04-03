import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { QueryClient } from "@tanstack/react-query";
import { BackendResponse, CustomError } from "../entities";
import { AugConfig, BackendResponseLog } from "../store";
import APIClient from "./api-client";
import invalidateQueries from "./invalidateQueries";

interface Props {
  queryClient: QueryClient;
  toast: (options: UseToastOptions) => ToastId;
  augConfig: AugConfig;
  setIsLoading: (value: React.SetStateAction<boolean>) => void;
  setBackendResponseLog: <K extends keyof BackendResponseLog>(
    key: K,
    value: BackendResponseLog[K]
  ) => void;
}

/**
 * Handles the full image/mask augmentation workflow.
 *
 * This includes:
 * - Sending augmentation config and stratification data to the backend
 * - Triggering the augmentation pipeline
 * - Transferring both zipped and resized data to GCS
 * - Resetting signed URLs for the split datasets
 * - Displaying toast notifications and updating query cache
 *
 * @param queryClient - React Query client for cache invalidation
 * @param toast - Chakra UI toast function for user feedback
 * @param augConfig - Full configuration for augmentation
 * @param setIsLoading - Sets frontend loading state
 * @param setBackendResponseLog - Sets backend operation flags in state
 */
const handleAugment = async ({
  queryClient,
  toast,
  augConfig,
  setIsLoading,
  setBackendResponseLog,
}: Props) => {
  setIsLoading(true);
  setBackendResponseLog("augmentationIsRunning", true);

  const augmentationClient = new APIClient<BackendResponse>("/augment");
  const zippedDataTransferClient = new APIClient<BackendResponse>(
    "/gcs/transfer_augmented_zip_to_gcs"
  );
  const resizedDataTransferClient = new APIClient<BackendResponse>(
    "/gcs/transfer_resized_augmented_data_to_gcs"
  );
  const resetTrainValTestClient = new APIClient<BackendResponse>(
    "/reset-signed-urls-for-resized-train-val-test-sets"
  );

  // Prepare FormData
  const formData = new FormData();
  if (augConfig.stratificationDataFile?.file) {
    formData.append(
      "stratificationDataFile",
      augConfig.stratificationDataFile.file
    );
  }

  // Exclude stratification file from config and append the reduced config
  const { stratificationDataFile, ...reducedConfig } = augConfig;
  formData.append("config", JSON.stringify(reducedConfig));

  try {
    // Step 1: Run augmentation on backend
    const augmentation = await augmentationClient.postData(formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (!augmentation.success) {
      if (augmentation.errorType === "StratifiedSplitError") {
        throw new CustomError("Stratified Split Error", augmentation.message!);
      }
      throw new CustomError("Augmentation State", augmentation.message!);
    }

    // Step 2: Transfer zipped augmented data to GCS
    const zippedDataTransfer = await zippedDataTransferClient.postData();
    if (!zippedDataTransfer.success) {
      throw new CustomError(
        "Augmented Result Transfer",
        "Failed to transfer augmented result to GCS bucket."
      );
    }

    // Step 3: Transfer resized augmented data to GCS
    const resizeDataTransfer = await resizedDataTransferClient.postData();
    if (!resizeDataTransfer.success) {
      throw new CustomError(
        "Resized Augmented Data Transfer",
        "Failed to transfer resized augmented result to GCS bucket."
      );
    }

    // Step 4: Reset signed URLs for the updated datasets
    const signedUrlReset = await resetTrainValTestClient.executeAction();
    if (!signedUrlReset.success) {
      throw new CustomError(
        "Resetting Train, Val and Test signed url.",
        "Failed to reset signed URLs for Train, Val and Test sets."
      );
    }

    // Final Step: Success feedback and query cache invalidation
    toast({
      title: "Augmentation completed!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    invalidateQueries(queryClient, [
      "augmentationIsComplete",
      "trainingSet",
      "validationSet",
      "testingSet",
    ]);
  } catch (error: any) {
    // Handle and display errors from backend
    const title = error.response?.data?.title || "Augmentation Failed";
    const description =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred during augmentation.";

    toast({
      title,
      description,
      status: "error",
      isClosable: true,
    });
  } finally {
    setIsLoading(false);
    setBackendResponseLog("augmentationIsRunning", false);
  }
};

export default handleAugment;
