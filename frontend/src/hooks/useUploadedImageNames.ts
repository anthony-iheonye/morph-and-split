import { useQuery } from "@tanstack/react-query";
import APIClient, { FetchResponse } from "../services/api-client";

const apiClient = new APIClient<string[]>("/upload/image_names");

const useUploadedImageNames = () =>
  useQuery<FetchResponse<string[]>, Error>({
    queryKey: ["image_names"],
    queryFn: apiClient.getAll,
    // staleTime: ms("10min"),
  });

export default useUploadedImageNames;
