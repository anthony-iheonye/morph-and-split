import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { QueryClient } from "@tanstack/react-query";
import { AugConfig, BackendResponseLog, bucketFolders } from "../store";
import React from "react";
import { SignedUrls, BackendResponse, CustomError } from "../entities";
import APIClient from "./api-client";
import invalidateQueries from "./invalidateQueries";

interface Props {
  files: File[];
  queryClient: QueryClient;
  toast: (options: UseToastOptions) => ToastId;
  augConfig: AugConfig;
  setIsUploading: (value: React.SetStateAction<boolean>) => void;
  setBackendResponseLog: <K extends keyof BackendResponseLog>(
    key: K,
    value: BackendResponseLog[K]
  ) => void;
}

const handleImageUpload = async ({
  files,
  queryClient,
  toast,
  augConfig,
  setIsUploading,
  setBackendResponseLog,
}: Props) => {
  // API Clients
  const uploadClient = new APIClient<SignedUrls>("/generate-signed-upload-url");

  const imageTransferClient = new APIClient<BackendResponse>(
    "/gcs/transfer_images_to_backend"
  );

  const resizeClient = new APIClient<BackendResponse>(
    "/resize-uploaded-images"
  );

  const resizedImageTransferClient = new APIClient<BackendResponse>(
    "/gcs/transfer_resized_original_images_to_gcs"
  );

  const deleteStratificationFileClient = new APIClient(
    "/stratification_data_file/delete"
  );

  try {
    setIsUploading(true);
    setBackendResponseLog("imageIsUploading", true);

    // Upload Images to Google Cloud Storaege (GCS) bucket.
    const uploaded = await uploadClient.uploadToGoogleCloudBucket(
      files,
      bucketFolders.images
    );
    if (!uploaded.success) {
      throw new CustomError(
        "Upload Failed",
        "Failed to upload images to Google Cloud."
      );
    }

    // Transfer uploaded images from GCS bucket to backend
    const imagesTransfered = await imageTransferClient.postData();
    if (!imagesTransfered.success) {
      throw new CustomError(
        "Transfer Failed",
        "Failed to transfer images to the backend"
      );
    }

    // Resize uploaded images
    const resized = await resizeClient.postData();
    if (!resized.success) {
      throw new CustomError(
        "Resize Failed",
        "Failed to resize uploaded images."
      );
    }

    // Transfer resized images to GCS bucket for frontend preview
    const resizedImagesTransfered = await resizedImageTransferClient.postData();
    if (!resizedImagesTransfered.success) {
      throw new CustomError(
        "Resized Image Transfer Failed.",
        "Failed to transfer resized images."
      );
    }

    // Delete stratification data file from backend storage
    const response =
      await deleteStratificationFileClient.deleteFileOrDirectory();
    if (!response.success) {
      toast({
        title: response.error,
        description: response.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else {
      // Invalidate uploaded image names, uploaded image and mask metadata, and image upload status.
      invalidateQueries(queryClient, [
        "imageNames",
        "metadata",
        "imageUploadStatus",
        "imageMaskBalanceStatus",
        "stratificationFileName",
        "strafied_split_parameters",
      ]);
      toast({
        title: "Upload Successful",
        description: "Images uploaded successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  } catch (error: any) {
    toast({
      title: error.title || "Image Upload Failed",
      description: error.message || "An unexpected error occurred.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  } finally {
    setIsUploading(false);
    setBackendResponseLog("imageIsUploading", false);
  }
};

export default handleImageUpload;
