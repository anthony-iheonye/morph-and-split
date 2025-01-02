import { useQuery } from "@tanstack/react-query";
import APIClient, { FetchResponse } from "../services/api-client";
import ms from "ms";

const apiClient = new APIClient<string[]>("/upload/mask_names");

const useUploadedMaskNames = () =>
  useQuery<FetchResponse<string[]>, Error>({
    queryKey: ["mask_names"],
    queryFn: apiClient.getAll,
    staleTime: ms("60min"),
  });

export default useUploadedMaskNames;
