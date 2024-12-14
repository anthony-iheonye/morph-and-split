import { useLocation } from "react-router-dom";

export const parentNames = {
  uploadImageAndMask: "uploadImageAndMask",
  augmentationConfig: "augmentationConfig",
  augment: "augment",
};

const useActiveParent = () => {
  const location = useLocation();
  const { augment, augmentationConfig, uploadImageAndMask } = parentNames;

  const activeParent =
    location.pathname.startsWith("/upload_data") || location.pathname === ""
      ? uploadImageAndMask
      : location.pathname.startsWith("/settings")
      ? augmentationConfig
      : location.pathname.startsWith("/augment")
      ? augment
      : null;

  return activeParent;
};

export default useActiveParent;
