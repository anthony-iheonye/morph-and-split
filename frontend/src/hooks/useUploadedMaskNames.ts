import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { FetchResponse } from "../entities";
import { APIClient } from "../services";

const apiClient = new APIClient<string[]>("/upload/mask_names");

const useUploadedMaskNames = () =>
  useQuery<FetchResponse<string[]>, Error>({
    queryKey: ["maskNames"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"),
  });

export default useUploadedMaskNames;
