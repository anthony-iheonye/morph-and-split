import { useLocation } from "react-router-dom";

/**
 * Returns names of the sub
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
      : location.pathname === "/settings/visual_attributes"
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
