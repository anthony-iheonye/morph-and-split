import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { FetchResponse } from "../entities";
import { APIClient } from "../services";

// API client to fetch the uploaded stratification data filename
const apiClient = new APIClient<string[]>(
  "/upload/backend/stratification_data_filename"
);

/**
 * Custom hook to fetch the name of the uploaded stratification CSV file.
 *
 * This is useful for UI display or conditionally showing split options.
 * The result is cached for 24 hours to reduce redundant requests.
 *
 * @returns React Query result containing the filename(s)
 */
const useStratificationDataFileName = () =>
  useQuery<FetchResponse<string[]>, Error>({
    queryKey: ["stratificationFileName"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
  });

export default useStratificationDataFileName;
