import { useQuery } from "@tanstack/react-query";
import UploadedImageMask from "../entities/UploadedImageMask";
import APIClient, { FetchResponse } from "../services/api-client";
import ms from "ms";

const apiClient = new APIClient<UploadedImageMask>(
  "/metadata/val_images_masks"
);

const useValidationSet = () =>
  useQuery<FetchResponse<UploadedImageMask>>({
    queryKey: ["validation_set"],
    queryFn: apiClient.getAll,
    staleTime: ms("30min"),
  });

export default useValidationSet;
