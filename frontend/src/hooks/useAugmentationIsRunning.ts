import { useQuery } from "@tanstack/react-query";
import { APIClient } from "../services";
import { BackendResponse } from "../entities";
import ms from "ms";

const apiClient = new APIClient("/status_checks/augmentation_is_running");

const useAugmentationIsRunning = () => {
  return useQuery<BackendResponse, Error>({
    queryKey: ["augmentationIsRunning"],
    queryFn: apiClient.getStatus,
    staleTime: ms("24hr"),
  });
};

export default useAugmentationIsRunning;
