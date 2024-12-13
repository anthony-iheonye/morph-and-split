import { useQuery } from "@tanstack/react-query";
import UploadedImageMask from "../entities/UploadedImageMask";
import APIClient, { FetchResponse } from "../services/api-client";
import ms from "ms";

const apiClient = new APIClient<UploadedImageMask>(
  "/metadata/train_images_masks"
);

const useTrainingSet = () =>
  useQuery<FetchResponse<UploadedImageMask>>({
    queryKey: ["training_set"],
    queryFn: apiClient.getAll,
    staleTime: ms("30min"),
  });

export default useTrainingSet;
