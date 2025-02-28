import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { QueryClient } from "@tanstack/react-query";
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

const handleDeleteStratDataFile = async ({
  queryClient,
  toast,
  setBackendResponseLog,
}: Props) => {
  const deleteStratificationFileClient = new APIClient(
    "/stratification_data_file/delete"
  );

  try {
    setBackendResponseLog("deletingStratDataFile", true);

    // Delete stratification data file from backend storage
    const response =
      await deleteStratificationFileClient.deleteFileOrDirectory();
    if (!response.success) {
      toast({
        title: response.error,
        description: response.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      invalidateQueries(queryClient, [
        "stratificationFileName",
        "strafied_split_parameters",
      ]);
    }
  } catch (error: any) {
    const errorTitle = error.response?.data?.error || "Delete Error";
    const errorDescription =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    toast({
      title: errorTitle,
      description: errorDescription,
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  } finally {
    setBackendResponseLog("deletingStratDataFile", false);
  }
};

export default handleDeleteStratDataFile;
