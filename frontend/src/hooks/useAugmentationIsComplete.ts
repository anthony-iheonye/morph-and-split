import { useQuery } from "@tanstack/react-query";
import { BackendResponse } from "../entities";
import { APIClient } from "../services";
import ms from "ms";

// API client to check if augmentation has completed
const statusClient = new APIClient<BackendResponse>(
  "/status_checks/augmentation_is_complete"
);

/**
 * Custom hook to check whether image/mask augmentation is complete.
 *
 * This hook:
 * - Queries the backend for augmentation completion status
 * - Caches the result for 24 hours
 *
 * @returns React Query result containing the augmentation status
 */
const useAugmentationIsComplete = () => {
  return useQuery<BackendResponse, Error>({
    queryKey: ["augmentationIsComplete"],
    queryFn: statusClient.getStatus,
    staleTime: ms("24h"),
  });
};

export default useAugmentationIsComplete;
