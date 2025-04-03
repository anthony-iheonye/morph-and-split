import { useInfiniteQuery } from "@tanstack/react-query";
import ms from "ms";
import { FetchResponse, UploadedImageMask } from "../entities";
import { APIClient } from "../services";

// API client for fetching training set metadata from GCS
const apiClient = new APIClient<UploadedImageMask>(
  "/metadata/gcs/resized-train-set"
);

/**
 * Custom hook to fetch paginated training set metadata from GCS.
 *
 * Uses React Query's `useInfiniteQuery` to:
 * - Fetch metadata for 10 files per page
 * - Load additional pages automatically
 * - Cache results for 24 hours
 *
 * @returns React Query infinite query object with data, error, fetchNextPage, etc.
 */
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
    staleTime: ms("24h"), // Cache duration: 24 hours
  });

export default useTrainingSet;
