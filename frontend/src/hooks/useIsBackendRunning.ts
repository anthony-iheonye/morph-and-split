import { useQuery } from "@tanstack/react-query";
import { BackendResponse } from "../entities";
import { APIClient } from "../services";
import ms from "ms";

// API client for checking if the backend server is running
const backendStatusClient = new APIClient<BackendResponse>(
  "/status_checks/backend_is_running"
);

/**
 * Custom hook to check whether the backend service is currently running.
 *
 * This hook:
 * - Sends a status check to the backend
 * - Caches the result for 24 hours
 * - Helps conditionally render UI based on backend availability
 *
 * @returns React Query result with backend running status
 */
const useIsBackendRunning = () => {
  return useQuery<BackendResponse, Error>({
    queryKey: ["backendIsRunning"],
    queryFn: backendStatusClient.getStatus,
    staleTime: ms("24h"),
  });
};

export default useIsBackendRunning;
