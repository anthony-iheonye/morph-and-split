import { useLocation } from "react-router-dom";

/**
 * Object mapping sub-route names for identifying active sub-navigation items.
 */
export const subParentNames = {
  uploadImages: "uploadImages",
  uploadMasks: "uploadMasks",
  previewUpload: "previewUpload",
  dataSplit: "dataSplit",
  transformation: "transformation",
  visualAtttributes: "visualAttributes",
  preProcessing: "preprocessing",
  startAugmentation: "startAugmentation",
  previewResult: "previewResult",
};

/**
 * Custom hook that returns the active sub-parent section name
 * based on the current route pathname.
 *
 * This is used to highlight the active sub-navigation item within a parent tab.
 *
 * @returns A string representing the active sub-parent section or `null` if unmatched.
 */
const useActiveSubParent = () => {
  const location = useLocation();

  const {
    uploadImages,
    uploadMasks,
    previewUpload,
    dataSplit,
    transformation,
    visualAtttributes,
    preProcessing,
    startAugmentation,
    previewResult,
  } = subParentNames;

  const activeSubParent =
    location.pathname === "/upload_data" ||
    location.pathname === "/upload_data/images"
      ? uploadImages
      : location.pathname === "/upload_data/masks"
      ? uploadMasks
      : location.pathname === "/upload_data/preview"
      ? previewUpload
      : location.pathname === "/settings" ||
        location.pathname === "/settings/data_split"
      ? dataSplit
      : location.pathname === "/settings/select_transformation"
      ? transformation
      : location.pathname === "/settings/stratified_splitting"
      ? visualAtttributes
      : location.pathname === "/settings/pre_processing"
      ? preProcessing
      : location.pathname === "/augment" ||
        location.pathname === "/augment/start_augmentation"
      ? startAugmentation
      : location.pathname === "/augment/preview"
      ? previewResult
      : null;

  return activeSubParent;
};

export default useActiveSubParent;
