import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { FetchResponse } from "../entities";
import { APIClient } from "../services";

const apiClient = new APIClient<string>("/stratification_data_file/parameters");

const useStratifiedSplitParameters = () =>
  useQuery<FetchResponse<string>, Error>({
    queryKey: ["strafied_split_parameters"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
  });

export default useStratifiedSplitParameters;
