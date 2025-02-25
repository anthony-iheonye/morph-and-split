import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { AugConfig, BackendResponseLog } from "../store";
import invalidateQueries from "./invalidateQueries";
import APIClient from "./api-client";
import { BackendResponse, CustomError } from "../entities";
import { QueryClient } from "@tanstack/react-query";

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

const handleAugment = async ({
  queryClient,
  toast,
  augConfig,
  setIsLoading,
  setBackendResponseLog,
}: Props) => {
  setIsLoading(true);
  setBackendResponseLog("augmentationIsRunning", true);

  const AugmentationAPI = new APIClient<BackendResponse>("/augment");
  const ZippedDataTransferAPI = new APIClient<BackendResponse>(
    "/gcs/transfer_augmented_zip_to_gcs"
  );
  const ResizedDataTransferAPI = new APIClient<BackendResponse>(
    "/gcs/transfer_resized_augmented_data_to_gcs"
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

  // Prepare FormData
  const formData = new FormData();
  if (augConfig.visualAttributesJSONFile?.file)
    formData.append(
      "visualAttributesJSONFile",
      augConfig.visualAttributesJSONFile.file
    );

  // Exclude visual attribute file from config and add reduced config
  const { visualAttributesJSONFile, ...reducedConfig } = augConfig; // Destruture to exclude
  formData.append("config", JSON.stringify(reducedConfig)); // Add only the reduced

  try {
    // Augment Images and Masks
    const augmentation = await AugmentationAPI.postData(formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (!augmentation.success) {
      throw new CustomError(
        "Augmentation State",
        "Failed to complete augmentation."
      );
    }

    // Transfer compressed augmented data to Google cloud storage Bucket
    const zippedDataTransfer = await ZippedDataTransferAPI.postData();

    if (!zippedDataTransfer.success) {
      throw new CustomError(
        "Augmented Result Transfer",
        "Failed to transfer augmented result to GCS bucket."
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

    // Transfer resized augmented data to Google cloud storage bucket
    const resizeDataTransfer = await ResizedDataTransferAPI.postData();
    if (!resizeDataTransfer.success) {
      throw new CustomError(
        "Resized Augmented Data Transfer",
        "Failed to tranfer resized augmented result to GCS bucket."
      );
    } else {
      toast({
        title: "Augmentation completed!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      invalidateQueries(queryClient, ["augmentationIsComplete"]);
    }
  } catch (error) {
    console.error("Error during augmentation:", error);
    toast({
      title: "Failed to complete augmentation.",
      description: "An unknown error occurred.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  } finally {
    setIsLoading(false);
    setBackendResponseLog("augmentationIsRunning", false);
  }
};

export default handleAugment;
