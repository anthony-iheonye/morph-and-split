import { useInfiniteQuery } from "@tanstack/react-query";
import ms from "ms";
import { FetchResponse, UploadedImageMask } from "../entities";
import { APIClient } from "../services";

// API client for fetching validation set image and mask metadata
const apiClient = new APIClient<UploadedImageMask>(
  "/metadata/gcs/resized-val-set"
);

/**
 * Custom hook to fetch paginated validation set metadata from GCS.
 *
 * Uses React Query's `useInfiniteQuery` to:
 * - Fetch 10 items per page
 * - Cache data for 24 hours
 * - Automatically fetch the next page if available
 *
 * @returns React Query object with data, fetchNextPage, hasNextPage, etc.
 */
const useValidationSet = () =>
  useInfiniteQuery<FetchResponse<UploadedImageMask>, Error>({
    queryKey: ["validationSet"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.getAll({
        params: { page: pageParam, page_size: 10 },
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
    staleTime: ms("24h"), // Data is fresh for 24 hours
  });

export default useValidationSet;
