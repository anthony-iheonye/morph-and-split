import { useQuery } from "@tanstack/react-query";
import { APIClient } from "../services";
import ms from "ms";
import { BackendResponse } from "../entities";

// API client for checking if a session is currently active
const apiClient = new APIClient("/status_checks/session_is_running");

/**
 * Custom hook to check if a session is currently active.
 *
 * Queries the backend session status and caches the result for 24 hours.
 * Useful for conditionally showing UI elements based on session lifecycle.
 *
 * @returns React Query result containing the backend session status
 */
const useSessionIsRunning = () => {
  return useQuery<BackendResponse, Error>({
    queryKey: ["sessionIsRunning"],
    queryFn: apiClient.getStatus,
    staleTime: ms("24hr"),
  });
};

export default useSessionIsRunning;
