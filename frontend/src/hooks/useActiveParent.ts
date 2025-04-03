import { useLocation } from "react-router-dom";

/**
 * Object mapping parent route names used for navigation highlighting.
 */
export const parentNames = {
  home: "home",
  uploadImageAndMask: "uploadImageAndMask",
  augmentationConfig: "augmentationConfig",
  augment: "augment",
};

/**
 * Custom hook that returns the active parent section name
 * based on the current route.
 *
 * This is used for determining which main navigation icon is active.
 *
 * @returns A string representing the active parent section or `null` if not matched.
 */
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
