import { useBackendResponseStore, BackendResponseStore } from "../store";

/**
 * Custom hook to access and manipulate backend response flags stored in Zustand.
 *
 * Provides:
 * - Boolean flags for each async backend operation (e.g. uploading, deleting, resetting)
 * - The full backendResponseLog state
 * - Setters to update individual flags
 * - A resetter to restore all flags to their initial state
 *
 * Useful for managing loading states and conditional UI during async tasks.
 *
 * @returns An object containing all backend status flags and their modifiers.
 */
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
