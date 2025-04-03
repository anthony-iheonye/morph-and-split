import { useInfiniteQuery } from "@tanstack/react-query";
import ms from "ms";
import { FetchResponse, UploadedImageMask } from "../entities";
import { APIClient } from "../services";

// API client for fetching testing set metadata from GCS
const apiClient = new APIClient<UploadedImageMask>(
  "/metadata/gcs/resized-test-set"
);

/**
 * Custom hook to fetch paginated testing set metadata from GCS.
 *
 * Uses React Query's `useInfiniteQuery` to:
 * - Load 10 image/mask metadata items per page
 * - Automatically fetch additional pages
 * - Cache data for 24 hours to reduce redundant requests
 *
 * @returns React Query result for testing set pagination
 */
const useTestingSet = () =>
  useInfiniteQuery<FetchResponse<UploadedImageMask>, Error>({
    queryKey: ["testingSet"],
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

export default useTestingSet;
