import { useInfiniteQuery } from "@tanstack/react-query";
import ms from "ms";
import UploadedImageMask from "../entities/UploadedImageMask";
import APIClient, { FetchResponse } from "../services/api-client";

const apiClient = new APIClient<UploadedImageMask>(
  "/metadata/gcs/resized_original_images_masks"
);

/**
 * Custom hook to fetch metadata of uploaded images and masks from the backend.
 *
 * This hook utilizes `react-query` to fetch metadata that includes the names
 * and URLs of images and masks stored on the backend. The data is cached to
 * minimize unnecessary network requests and is automatically invalidated
 * after the specified `staleTime`.
 *
 * **Usage Example:**
 * ```typescript
 * const { data, isLoading, isError } = useUploadedImageMask();
 *
 * if (isLoading) return <Spinner />;
 * if (isError) return <Text>Error fetching metadata</Text>;
 *
 * return (
 *   <ul>
 *     {data?.results.map((item) => (
 *       <li key={item.image.name}>
 *         Image: <a href={item.image.url}>{item.image.name}</a>
 *         Mask: <a href={item.mask.url}>{item.mask.name}</a>
 *       </li>
 *     ))}
 *   </ul>
 * );
 * ```
 *
 * @returns An object containing:
 * - `data`: The fetched metadata, structured as `FetchResponse<ImageMaskMetadata>`.
 * - `isLoading`: A boolean indicating if the data is being fetched.
 * - `isError`: A boolean indicating if an error occurred during the fetch.
 * - Other properties from `useQuery` (e.g., `refetch`, `isFetching`).
 */

const useUploadedImageMask = () =>
  useInfiniteQuery<FetchResponse<UploadedImageMask>, Error>({
    queryKey: ["metadata"],
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

export default useUploadedImageMask;
