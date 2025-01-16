import { useQuery } from "@tanstack/react-query";
import { BackendResponse } from "../entities";
import { APIClient } from "../services";
import ms from "ms";

const statusClient = new APIClient<BackendResponse>("/mask_upload_status");

const useMaskUploadStatus = () => {
  useQuery<BackendResponse>({
    queryKey: ["mask_upload_status"],
    queryFn: statusClient.getStatus,
    staleTime: ms("24h"),
  });
};

export default useMaskUploadStatus;
