import { useBackendResponseStore, BackendResponseStore } from "../store";

const useBackendResponse = () => {
  const {
    imageIsUploading,
    maskIsUploading,
    augmentationIsRunning,
    deletingImages,
    deletingMasks,
    deletingStratDataFile,
    backendResponseLog,
    isResetting,
    isShuttingDown,
    isDownloading,
    setBackendResponseLog,
    resetBackendResponseLog,
  } = useBackendResponseStore((store: BackendResponseStore) => ({
    imageIsUploading: store.backendResponseLog.imageIsUploading,
    maskIsUploading: store.backendResponseLog.maskIsUploading,
    augmentationIsRunning: store.backendResponseLog.augmentationIsRunning,
    deletingImages: store.backendResponseLog.deletingImages,
    deletingMasks: store.backendResponseLog.deletingMasks,
    isResetting: store.backendResponseLog.isResetting,
    isShuttingDown: store.backendResponseLog.isShuttingDown,
    isDownloading: store.backendResponseLog.isDownloading,
    deletingStratDataFile: store.backendResponseLog.deletingStratDataFile,
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
    deletingStratDataFile,
    isResetting,
    isShuttingDown,
    isDownloading,
    backendResponseLog,
    setBackendResponseLog,
    resetBackendResponseLog,
  };
};

export default useBackendResponse;
