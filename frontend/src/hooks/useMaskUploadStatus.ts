import { useQuery } from "@tanstack/react-query";
import { BackendResponse } from "../entities";
import { APIClient } from "../services";
import ms from "ms";

// API client for checking the status of mask uploads
const statusClient = new APIClient<BackendResponse>(
  "/status_checks/mask_upload_status"
);

/**
 * Custom hook to check whether masks have been uploaded to the backend.
 *
 * This hook:
 * - Queries the backend for mask upload status
 * - Caches the result for 24 hours
 *
 * @returns React Query result containing the upload status response
 */
const useMaskUploadStatus = () => {
  return useQuery<BackendResponse, Error>({
    queryKey: ["maskUploadStatus"],
    queryFn: statusClient.getStatus,
    staleTime: ms("24h"),
  });
};

export default useMaskUploadStatus;
