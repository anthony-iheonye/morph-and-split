import { useQuery } from "@tanstack/react-query";
import { APIClient } from "../services";
import ms from "ms";
import { BackendResponse } from "../entities";

const apiClient = new APIClient("/status_checks/session_is_running");

const useSessionIsRunning = () => {
  return useQuery<BackendResponse, Error>({
    queryKey: ["sessionIsRunning"],
    queryFn: apiClient.getStatus,
    staleTime: ms("24hr"),
  });
};

export default useSessionIsRunning;
