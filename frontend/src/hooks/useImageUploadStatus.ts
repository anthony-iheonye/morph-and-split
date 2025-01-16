import { useQuery } from "@tanstack/react-query";
import { BackendResponse } from "../entities";
import { APIClient } from "../services";
import ms from "ms";

const statusClient = new APIClient<BackendResponse>("/image_upload_status");

const useImageUploadStatus = () => {
  return useQuery<BackendResponse, Error>({
    queryKey: ["imageUploadStatus"],
    queryFn: statusClient.getStatus,
    staleTime: ms("24h"),
  });
};

export default useImageUploadStatus;
