import { useQuery } from "@tanstack/react-query";
import { BackendResponse } from "../entities";
import { APIClient } from "../services";
import ms from "ms";

// API client to check if the number of uploaded images matches the number of masks
const statusClient = new APIClient<BackendResponse>(
  "/status_checks/image_mask_balance_status"
);

/**
 * Custom hook to check whether the number of uploaded images and masks are balanced.
 *
 * This hook:
 * - Queries the backend for balance status
 * - Caches the result for 24 hours
 *
 * Used to ensure users don't proceed to augmentation with mismatched datasets.
 *
 * @returns React Query result containing the backend status response
 */
const useImageMaskBalanceStatus = () => {
  return useQuery<BackendResponse, Error>({
    queryKey: ["imageMaskBalanceStatus"],
    queryFn: statusClient.getStatus,
    staleTime: ms("24h"),
  });
};

export default useImageMaskBalanceStatus;
