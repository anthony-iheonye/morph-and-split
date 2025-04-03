import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { FetchResponse } from "../entities";
import { APIClient } from "../services";

// API client for fetching available stratified split parameters from uploaded CSV
const apiClient = new APIClient<string>("/stratification_data_file/parameters");

/**
 * Custom hook to fetch available parameters for stratified splitting.
 *
 * This hook:
 * - Retrieves column names from the uploaded stratification CSV file
 * - Caches the result for 24 hours
 *
 * @returns React Query result containing the list of parameter names
 */
const useStratifiedSplitParameters = () =>
  useQuery<FetchResponse<string>, Error>({
    queryKey: ["strafied_split_parameters"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
  });

export default useStratifiedSplitParameters;
