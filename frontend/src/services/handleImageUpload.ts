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

/**
 * Handles the full upload pipeline for images in the Morph and Split app.
 *
 * Workflow:
 * 1. Uploads raw image files to Google Cloud Storage using signed URLs.
 * 2. Transfers uploaded images from GCS to the backend project directory.
 * 3. Resizes the images on the backend.
 * 4. Transfers the resized images back to GCS for frontend preview.
 * 5. Deletes any existing stratification data file to avoid stale state.
 * 6. Invalidates relevant queries and shows user feedback via toast.
 *
 * @param files - Array of image files to upload.
 * @param queryClient - React Query client for invalidating cached data.
 * @param toast - Chakra UI toast for showing success or error messages.
 * @param augConfig - Current augmentation config (not used here but passed for consistency).
 * @param setIsUploading - Sets the uploading state in the UI.
 * @param setBackendResponseLog - Zustand action to flag backend operation status.
 */
const handleImageUpload = async ({
  files,
  queryClient,
  toast,
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

    // Step 1: Upload images to GCS using signed URLs
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

    // Step 2: Transfer uploaded images to backend project directory
    const imagesTransfered = await imageTransferClient.postData();
    if (!imagesTransfered.success) {
      throw new CustomError(
        "Transfer Failed",
        "Failed to transfer images to the backend"
      );
    }

    // Step 3: Resize the uploaded images
    const resized = await resizeClient.postData();
    if (!resized.success) {
      throw new CustomError(
        "Resize Failed",
        "Failed to resize uploaded images."
      );
    }

    // Step 4: Upload resized images back to GCS for frontend preview
    const resizedImagesTransfered = await resizedImageTransferClient.postData();
    if (!resizedImagesTransfered.success) {
      throw new CustomError(
        "Resized Image Transfer Failed.",
        "Failed to transfer resized images."
      );
    }

    // Step 5: Delete old stratification data (if any)
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
      // Step 6: Invalidate related query caches and show success toast
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
        duration: 2000,
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
