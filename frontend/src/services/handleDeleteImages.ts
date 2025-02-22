import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { QueryClient } from "@tanstack/react-query";
import { CustomError } from "../entities";
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

  try {
    setBackendResponseLog("deletingImages", true);
    // Delete image from backend storage
    const deletedImages = await deleteImageDirectoryClient.deleteDirectory();
    if (!deletedImages.success) {
      throw new CustomError(
        "Image Deletion failed",
        "Failed to delete uploaded and resized images."
      );
    }

    // Recreate image directory in backend
    const createdImageDirectory =
      await createImageDirectoryClient.executeAction();
    if (!createdImageDirectory.success) {
      throw new CustomError(
        "Directory Creation Failed",
        "Failed to create new images directory."
      );
    }

    // Delete and recreate resized image directory on Gooogle cloud bucket.
    const recreatResizedDirectory =
      await recreatResizedImageDirectoryClient.deleteDirectory();
    if (!recreatResizedDirectory.success) {
      throw new CustomError(
        "Resized Image Directory Creation Failed",
        "Failed to create new resized images directory."
      );
    } else {
      invalidateQueries(queryClient, ["imageNames"]);
      invalidateQueries(queryClient, ["imageUploadStatus"]);
    }
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
