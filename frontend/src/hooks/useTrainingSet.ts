import { useInfiniteQuery } from "@tanstack/react-query";
import ms from "ms";
import { FetchResponse, UploadedImageMask } from "../entities";
import { APIClient } from "../services";

const apiClient = new APIClient<UploadedImageMask>(
  "/metadata/gcs/resized-train-set"
);

const useTrainingSet = () =>
  useInfiniteQuery<FetchResponse<UploadedImageMask>, Error>({
    queryKey: ["trainingSet"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.getAll({
        params: { page: pageParam, page_size: 10 },
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
    staleTime: ms("24h"), //24 hours
  });

export default useTrainingSet;
