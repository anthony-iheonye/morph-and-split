import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import ImageMaskMetadata from "../entities/ImageMaskMetaData";
import APIClient, { FetchResponse } from "../services/api-client";

const apiClient = new APIClient<ImageMaskMetadata>("/metadata/image_mask");

const useImageMaskMetadata = () =>
  useQuery<FetchResponse<ImageMaskMetadata>, Error>({
    queryKey: ["metadata"],
    queryFn: apiClient.getAll,
    staleTime: ms("5min"),
  });

export default useImageMaskMetadata;
