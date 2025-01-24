import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { AugConfig, BackendResponseLog } from "../store";
import invalidateQueries from "./invalidateQueries";
import APIClient from "./api-client";
import { BackendResponse } from "../entities";
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
    const response = await AugmentationAPI.postData(formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.success) {
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
