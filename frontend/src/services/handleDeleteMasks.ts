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

const handleDeleteUploadedMasks = async ({
  queryClient,
  toast,
  setBackendResponseLog,
}: Props) => {
  const deleteDirectoryClient = new APIClient(
    "/project_directory/masks/delete"
  );
  const createDirectoryClient = new APIClient("project_directory/masks/create");

  try {
    setBackendResponseLog("deletingMasks", true);
    const deletedMasks = await deleteDirectoryClient.deleteDirectory();
    if (!deletedMasks.success) {
      throw new CustomError(
        "Masks Deletion failed",
        "Failed to delete uploaded and resized masks."
      );
    }

    const createdImageDirectory = await createDirectoryClient.executeAction();
    if (!createdImageDirectory.success) {
      throw new CustomError(
        "Directory Creation Failed",
        "Failed to create new masks directory."
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
