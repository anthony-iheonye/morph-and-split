import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import ImageMaskMetadata from "../entities/ImageMaskMetaData";
import APIClient, { FetchResponse } from "../services/api-client";

const apiClient = new APIClient<ImageMaskMetadata>("/metadata/image_mask");

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
  useQuery<FetchResponse<ImageMaskMetadata>, Error>({
    queryKey: ["metadata"],
    queryFn: apiClient.getAll,
    staleTime: ms("10min"), // Cache the data for 10 minutes
  });

export default useUploadedImageMask;
