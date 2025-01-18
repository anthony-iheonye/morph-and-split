import { useInfiniteQuery } from "@tanstack/react-query";
import ms from "ms";
import { FetchResponse, UploadedImageMask } from "../entities";
import { APIClient } from "../services";

const apiClient = new APIClient<UploadedImageMask>(
  "/metadata/test_images_masks"
);

const useTestingSet = () =>
  useInfiniteQuery<FetchResponse<UploadedImageMask>, Error>({
    queryKey: ["testingSet"],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getAll({
        params: { page: pageParam, page_size: 10 },
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
    staleTime: ms("24h"), //24 hours
  });

export default useTestingSet;
