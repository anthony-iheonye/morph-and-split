import { useQuery } from "@tanstack/react-query";
import { SignedUrls } from "../entities";
import { APIClient } from "../services";

// API client for refreshing signed download URLs for resized images and masks
const apiClient = new APIClient<SignedUrls[]>(
  "/generate-signed-urls-for-resized-images-and-masks"
);

/**
 * Custom hook to fetch fresh signed download URLs for resized images and masks.
 *
 * This hook:
 * - Forces a new fetch on every request and mount
 * - Ensures the backend returns updated signed URLs
 * - Avoids caching and automatic refetch on window focus
 *
 * @returns React Query result containing an array of SignedUrls
 */
const useRefreshUploadedImageMaskDownloadUrls = () =>
  useQuery({
    queryKey: ["imageMaskURLs"],
    queryFn: async () => {
      return await apiClient.getAll({ params: { refresh: true } });
    },
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

export default useRefreshUploadedImageMaskDownloadUrls;
