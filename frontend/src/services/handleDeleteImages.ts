import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { QueryClient } from "@tanstack/react-query";
import { BackendResponse, CustomError } from "../entities";
import { BackendResponseLog } from "../store";
import APIClient from "./api-client";
import invalidateQueries from "./invalidateQueries";

interface Props {
  queryClient: QueryClient;
  toast: (options: UseToastOptions) => ToastId;
  setBackendResponseLog: <K extends keyof BackendResponseLog>(
    key: K,
    value: BackendResponseLog[K]
  ) => void;
}

/**
 * Handles the deletion and recreation of the image directory,
 * along with cleanup and reset of resized images and signed URLs.
 *
 * Workflow:
 * 1. Deletes original and resized image directories from local and cloud storage.
 * 2. Recreates required image folders.
 * 3. Resets signed URLs for resized images and masks.
 * 4. Updates React Query cache.
 *
 * Displays appropriate toast notifications and sets loading flags via Zustand.
 *
 * @param queryClient - React Query client for invalidating stale queries.
 * @param toast - Chakra UI toast for displaying success or error messages.
 * @param setBackendResponseLog - Zustand store function to set deletion state.
 */
const handleDeleteImages = async ({
  queryClient,
  toast,
  setBackendResponseLog,
}: Props) => {
  const deleteImageDirectoryClient = new APIClient(
    "/project_directory/images/delete"
  );

  const createImageDirectoryClient = new APIClient(
    "project_directory/images/create"
  );

  const recreatResizedImageDirectoryClient = new APIClient(
    "/gcs/resized_original_images/delete"
  );

  const resetURLsClient = new APIClient<BackendResponse>(
    "reset-signed-urls-for-resized-images-and-masks"
  );

  try {
    setBackendResponseLog("deletingImages", true);

    // Step 1: Delete uploaded and resized images
    const deletedImages =
      await deleteImageDirectoryClient.deleteFileOrDirectory();
    if (!deletedImages.success) {
      throw new CustomError(
        "Image Deletion failed",
        "Failed to delete uploaded and resized images."
      );
    }

    // Step 2: Recreate empty local image directory
    const createdImageDirectory =
      await createImageDirectoryClient.executeAction();
    if (!createdImageDirectory.success) {
      throw new CustomError(
        "Directory Creation Failed",
        "Failed to create new images directory."
      );
    }

    // Step 3: Delete resized images in GCS and prepare for fresh upload
    const recreatResizedDirectory =
      await recreatResizedImageDirectoryClient.deleteFileOrDirectory();
    if (!recreatResizedDirectory.success) {
      throw new CustomError(
        "Resized Image Directory Creation Failed",
        "Failed to create new resized images directory."
      );
    }

    // Step 4: Reset signed URLs so new uploads are accessible
    const resetSignedUrls = await resetURLsClient.executeAction();
    if (!resetSignedUrls.success) {
      throw new CustomError(
        "Resetting signed URLs",
        "Failed to reset signed urls for resized images and mask."
      );
    }

    // Step 5: Invalidate stale queries
    invalidateQueries(queryClient, [
      "imageNames",
      "metadata",
      "imageUploadStatus",
      "imageMaskBalanceStatus",
    ]);
  } catch (error: any) {
    toast({
      title: "Error Deleting Images",
      description: error.message || "An unexpected error occurred.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  } finally {
    setBackendResponseLog("deletingImages", false);
  }
};

export default handleDeleteImages;
