import { useBackendResponseStore } from "../store";

const useBackendResponse = () => {
  const {
    imageIsUploading,
    maskIsUploading,
    augmentationIsRunning,
    deletingImages,
    deletingMasks,
    backendResponseLog,
    isResetting,
    isShuttingDown,
    isDownloading,
    setBackendResponseLog,
    resetBackendResponseLog,
  } = useBackendResponseStore((store) => ({
    imageIsUploading: store.backendResponseLog.imageIsUploading,
    maskIsUploading: store.backendResponseLog.maskIsUploading,
    augmentationIsRunning: store.backendResponseLog.augmentationIsRunning,
    deletingImages: store.backendResponseLog.deletingImages,
    deletingMasks: store.backendResponseLog.deletingMasks,
    isResetting: store.backendResponseLog.isResetting,
    isShuttingDown: store.backendResponseLog.isShuttingDown,
    isDownloading: store.backendResponseLog.isDownloading,
    backendResponseLog: store.backendResponseLog,
    setBackendResponseLog: store.setBackendResponseLog,
    resetBackendResponseLog: store.resetBackendResponseLog,
  }));

  return {
    imageIsUploading,
    maskIsUploading,
    augmentationIsRunning,
    deletingImages,
    deletingMasks,
    isResetting,
    isShuttingDown,
    isDownloading,
    backendResponseLog,
    setBackendResponseLog,
    resetBackendResponseLog,
  };
};

export default useBackendResponse;
