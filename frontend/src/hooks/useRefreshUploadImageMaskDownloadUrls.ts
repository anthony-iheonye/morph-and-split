import { useQuery } from "@tanstack/react-query";
import { SignedUrls } from "../entities";
import { APIClient } from "../services";

const apiClient = new APIClient<SignedUrls[]>(
  "/generate-signed-urls-for-resized-images-and-masks"
);

const useRefreshUploadedImageMaskDownloadUrls = () =>
  useQuery({
    queryKey: ["imageMaskURLs"], // Unique query key for caching
    queryFn: async () => {
      return await apiClient.getAll({ params: { refresh: true } }); // Ensure return
    },
    staleTime: 0, // Ensures fresh data on every request
    cacheTime: 0, // Prevents stale cache being used
    refetchOnMount: true, // Triggers refetch on component mount
    refetchOnWindowFocus: false, // Avoids automatic refetch on window focus
  });

export default useRefreshUploadedImageMaskDownloadUrls;
