import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { FetchResponse } from "../entities";
import { APIClient } from "../services";

const apiClient = new APIClient<string[]>(
  "/upload/backend/stratification_data_filename"
);

const useStratificationDataFileName = () =>
  useQuery<FetchResponse<string[]>, Error>({
    queryKey: ["stratificationFileName"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
  });

export default useStratificationDataFileName;
