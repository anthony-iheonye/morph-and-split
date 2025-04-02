import { useQuery } from "@tanstack/react-query";
import { BackendResponse } from "../entities";
import { APIClient } from "../services";
import ms from "ms";

const dimensionClient = new APIClient<BackendResponse>(
  "/metadata/uploaded-image-mask-dimension"
);

const useImageMaskDimension = () => {
  const { data } = useQuery<BackendResponse, Error>({
    queryKey: ["imageMaskDimension"],
    queryFn: dimensionClient.getStatus,
    staleTime: ms("24h"),
  });
  const imageHeight = data?.dimension?.height;
  const imageWidth = data?.dimension?.width;
  return { imageHeight, imageWidth };
};

export default useImageMaskDimension;
