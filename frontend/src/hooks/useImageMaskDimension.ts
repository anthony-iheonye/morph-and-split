import { useQuery } from "@tanstack/react-query";
import { BackendResponse } from "../entities";
import { APIClient } from "../services";
import ms from "ms";

// API client to fetch uploaded image and mask dimensions
const dimensionClient = new APIClient<BackendResponse>(
  "/metadata/uploaded-image-mask-dimension"
);

/**
 * Custom hook to retrieve the dimensions (height and width) of uploaded images and masks.
 *
 * This hook:
 * - Queries the backend for shared image/mask dimensions
 * - Extracts `imageHeight` and `imageWidth` from the response
 * - Caches the result for 24 hours
 *
 * @returns An object containing `imageHeight` and `imageWidth` (or undefined if not available)
 */
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
