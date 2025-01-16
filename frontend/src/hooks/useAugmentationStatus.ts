import { useQuery } from "@tanstack/react-query";
import { BackendResponse } from "../entities";
import { APIClient } from "../services";
import ms from "ms";

const statusClient = new APIClient<BackendResponse>(
  "/augmentation_complete_status"
);

const useAugmentationStatus = () => {
  return useQuery<BackendResponse, Error>({
    queryKey: ["augmentationIsComplete"],
    queryFn: statusClient.getStatus,
    staleTime: ms("24h"),
  });
};

export default useAugmentationStatus;
