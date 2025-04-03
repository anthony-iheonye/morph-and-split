import { useQuery } from "@tanstack/react-query";
import { BackendResponse } from "../entities";
import { APIClient } from "../services";
import ms from "ms";

// API client for checking if images have been uploaded
const statusClient = new APIClient<BackendResponse>(
  "/status_checks/image_upload_status"
);

/**
 * Custom hook to check whether image uploads have been completed.
 *
 * This hook:
 * - Queries the backend for the current image upload status
 * - Caches the result for 24 hours to avoid redundant checks
 *
 * @returns React Query result containing the backend status response
 */
const useImageUploadStatus = () => {
  return useQuery<BackendResponse, Error>({
    queryKey: ["imageUploadStatus"],
    queryFn: statusClient.getStatus,
    staleTime: ms("24h"),
  });
};

export default useImageUploadStatus;
