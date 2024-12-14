import { useQuery } from "@tanstack/react-query";
import APIClient, { FetchResponse } from "../services/api-client";
import ms from "ms";

const apiClient = new APIClient<string[]>("/upload/image_names");

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
    queryKey: ["image_names"],
    queryFn: apiClient.getAll,
    staleTime: ms("30min"),
  });

export default useUploadedImageNames;
