import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { FetchResponse } from "../entities";
import { APIClient } from "../services";

// API client to fetch uploaded mask file names
const apiClient = new APIClient<string[]>("/upload/backend/mask_names");

/**
 * Custom hook to fetch and cache uploaded mask file names.
 *
 * Uses React Query's `useQuery` to:
 * - Fetch the list of mask filenames from the backend
 * - Cache the result for 24 hours
 *
 * @returns React Query result containing the list of mask names
 */
const useUploadedMaskNames = () =>
  useQuery<FetchResponse<string[]>, Error>({
    queryKey: ["maskNames"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
  });

export default useUploadedMaskNames;
