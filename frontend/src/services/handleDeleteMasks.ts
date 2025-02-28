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
    const deletedMasks =
      await deleteMaskDirectoryClient.deleteFileOrDirectory();
    if (!deletedMasks.success) {
      throw new CustomError(
        "Masks Deletion failed",
        "Failed to delete uploaded and resized masks."
      );
    }

    const createdImageDirectory =
      await createMaskDirectoryClient.executeAction();
    if (!createdImageDirectory.success) {
      throw new CustomError(
        "Directory Creation Failed",
        "Failed to create new masks directory."
      );
    }

    // Delete and recreate resized image directory on Gooogle cloud bucket.
    const recreatResizedDirectory =
      await recreatResizedMaskDirectoryClient.deleteFileOrDirectory();
    if (!recreatResizedDirectory.success) {
      throw new CustomError(
        "Resized Mask Directory Creation Failed",
        "Failed to create new resized mask directory."
      );
    }

    // reset signed URLs for uploaded images and masks.
    const resetSignedUrls = await resetURLsClient.executeAction();
    if (!resetSignedUrls.success) {
      throw new CustomError(
        "Resetting signed URLs",
        "Failed to reset signed urls for resized images and mask ."
      );
    } else {
      invalidateQueries(queryClient, ["maskNames"]);
      invalidateQueries(queryClient, ["maskUploadStatus"]);
      invalidateQueries(queryClient, ["imageMaskBalanceStatus"]);
    }
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
