import { useLocation } from "react-router-dom";

export const parentNames = {
  home: "home",
  uploadImageAndMask: "uploadImageAndMask",
  augmentationConfig: "augmentationConfig",
  augment: "augment",
};

const useActiveParent = () => {
  const location = useLocation();
  const { augment, augmentationConfig, home, uploadImageAndMask } = parentNames;

  const activeParent =
    location.pathname === "/"
      ? home
      : location.pathname.startsWith("/upload_data")
      ? uploadImageAndMask
      : location.pathname.startsWith("/settings")
      ? augmentationConfig
      : location.pathname.startsWith("/augment")
      ? augment
      : null;

  return activeParent;
};

export default useActiveParent;
