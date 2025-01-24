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
  const deleteDirectoryClient = new APIClient(
    "/project_directory/images/delete"
  );
  const createDirectoryClient = new APIClient(
    "project_directory/images/create"
  );

  try {
    setBackendResponseLog("deletingImages", true);
    const deletedImages = await deleteDirectoryClient.deleteDirectory();
    if (!deletedImages.success) {
      throw new CustomError(
        "Image Deletion failed",
        "Failed to delete uploaded and resized images."
      );
    }

    const createdImageDirectory = await createDirectoryClient.executeAction();
    if (!createdImageDirectory.success) {
      throw new CustomError(
        "Directory Creation Failed",
        "Failed to create new images directory."
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
