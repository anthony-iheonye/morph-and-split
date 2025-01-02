import { useInfiniteQuery } from "@tanstack/react-query";
import ms from "ms";
import UploadedImageMask from "../entities/UploadedImageMask";
import APIClient, { FetchResponse } from "../services/api-client";

const apiClient = new APIClient<UploadedImageMask>(
  "/metadata/train_images_masks"
);

const useTrainingSet = () =>
  useInfiniteQuery<FetchResponse<UploadedImageMask>, Error>({
    queryKey: ["training_set"],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getAll({
        params: { page: pageParam, page_size: 10 },
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
    staleTime: ms("24h"), //24 hours
  });

export default useTrainingSet;
