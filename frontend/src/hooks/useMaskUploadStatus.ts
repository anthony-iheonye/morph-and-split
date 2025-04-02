import { useQuery } from "@tanstack/react-query";
import { BackendResponse } from "../entities";
import { APIClient } from "../services";
import ms from "ms";

const statusClient = new APIClient<BackendResponse>(
  "/status_checks/mask_upload_status"
);

const useMaskUploadStatus = () => {
  return useQuery<BackendResponse, Error>({
    queryKey: ["maskUploadStatus"],
    queryFn: statusClient.getStatus,
    staleTime: ms("24h"),
  });
};

export default useMaskUploadStatus;
