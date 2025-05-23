import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { FetchResponse } from "../entities";
import { APIClient } from "../services";

const apiClient = new APIClient<string[]>("/upload/backend/image_names");

/**
 * Custom hook to fetch the list of uploaded image names.
 *
 * This hook leverages `react-query` to fetch and cache image names from the
 * `/upload/image_names` API endpoint.
 *
 * Features:
 * - Caches results for 30 minutes to minimize redundant API calls.
 * - Automatically refetches when the query becomes stale.
 * - Uses `APIClient` abstraction for making API requests.
 *
 * @returns {UseQueryResult<FetchResponse<string[]>, Error>} The result of the query containing the list of image names
 * and loading/error states.
 *
 * @example
 * const { data, isLoading, error } = useUploadedImageNames();
 * if (isLoading) return <p>Loading...</p>;
 * if (error) return <p>Error: {error.message}</p>;
 * return <ul>{data.results.map(name => <li key={name}>{name}</li>)}</ul>;
 */
const useUploadedImageNames = () =>
  useQuery<FetchResponse<string[]>, Error>({
    queryKey: ["imageNames"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
  });

export default useUploadedImageNames;
