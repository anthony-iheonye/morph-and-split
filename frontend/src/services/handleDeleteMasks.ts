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
 * Handles deletion of uploaded and resized masks and resets the system state.
 *
 * Workflow:
 * 1. Deletes original mask directory from backend.
 * 2. Recreates the empty mask folder on the backend.
 * 3. Deletes resized masks from GCS to prepare for fresh uploads.
 * 4. Resets signed URLs for the resized mask/image data.
 * 5. Invalidates related React Query caches.
 *
 * Displays toast notifications for success/failure and toggles deletion state.
 *
 * @param queryClient - React Query client for cache invalidation.
 * @param toast - Chakra UI toast function for displaying user feedback.
 * @param setBackendResponseLog - Zustand state setter to toggle deletion state.
 */
const handleDeleteUploadedMasks = async ({
  queryClient,
  toast,
  setBackendResponseLog,
}: Props) => {
  const deleteMaskDirectoryClient = new APIClient(
    "/project_directory/masks/delete"
  );
  const createMaskDirectoryClient = new APIClient(
    "project_directory/masks/create"
  );

  const recreatResizedMaskDirectoryClient = new APIClient(
    "/gcs/resized_original_masks/delete"
  );

  const resetURLsClient = new APIClient<BackendResponse>(
    "reset-signed-urls-for-resized-images-and-masks"
  );

  try {
    setBackendResponseLog("deletingMasks", true);

    // Step 1: Delete uploaded and resized masks
    const deletedMasks =
      await deleteMaskDirectoryClient.deleteFileOrDirectory();
    if (!deletedMasks.success) {
      throw new CustomError(
        "Masks Deletion failed",
        "Failed to delete uploaded and resized masks."
      );
    }

    // Step 2: Recreate backend directory for fresh uploads
    const createdImageDirectory =
      await createMaskDirectoryClient.executeAction();
    if (!createdImageDirectory.success) {
      throw new CustomError(
        "Directory Creation Failed",
        "Failed to create new masks directory."
      );
    }

    // Step 3: Delete resized mask folder in GCS
    const recreatResizedDirectory =
      await recreatResizedMaskDirectoryClient.deleteFileOrDirectory();
    if (!recreatResizedDirectory.success) {
      throw new CustomError(
        "Resized Mask Directory Creation Failed",
        "Failed to create new resized mask directory."
      );
    }

    // Step 4: Reset signed URLs for resized image/mask access
    const resetSignedUrls = await resetURLsClient.executeAction();
    if (!resetSignedUrls.success) {
      throw new CustomError(
        "Resetting signed URLs",
        "Failed to reset signed urls for resized images and mask."
      );
    }

    // Step 5: Invalidate related queries
    invalidateQueries(queryClient, [
      "maskNames",
      "metadata",
      "maskUploadStatus",
      "imageMaskBalanceStatus",
    ]);
  } catch (error: any) {
    toast({
      title: "Error Deleting Masks",
      description: error.message || "An unexpected error occurred.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  } finally {
    setBackendResponseLog("deletingMasks", false);
  }
};

export default handleDeleteUploadedMasks;
