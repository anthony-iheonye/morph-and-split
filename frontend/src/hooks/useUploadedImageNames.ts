import { useQuery } from "@tanstack/react-query";
import APIClient, { FetchResponse } from "../services/api-client";
import ms from "ms";

const apiClient = new APIClient<string[]>("/upload/image_names");

const useUploadedImageNames = () =>
  useQuery<FetchResponse<string[]>, Error>({
    queryKey: ["image_names"],
    queryFn: apiClient.getAll,
    staleTime: ms("30min"),
  });

export default useUploadedImageNames;
