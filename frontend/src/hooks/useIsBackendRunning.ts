import { useQuery } from "@tanstack/react-query";
import { BackendResponse } from "../entities";
import { APIClient } from "../services";
import ms from "ms";

const backendStatusClient = new APIClient<BackendResponse>(
  "/status_checks/backend_is_running"
);

const useIsBackendRunning = () => {
  return useQuery<BackendResponse, Error>({
    queryKey: ["backendStatus"],
    queryFn: backendStatusClient.getStatus,
    staleTime: ms("24h"),
  });
};

export default useIsBackendRunning;
