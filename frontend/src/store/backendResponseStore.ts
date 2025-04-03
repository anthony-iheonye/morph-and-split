import { create } from "zustand";

/**
 * Tracks the state of backend operations and request flags.
 */
export interface BackendResponseLog {
  imageIsUploading: boolean;
  maskIsUploading: boolean;
  augmentationIsRunning: boolean;
  deletingImages: boolean;
  deletingMasks: boolean;
  deletingStratDataFile: boolean;
  isResetting: boolean;
  isShuttingDown: boolean;
  isDownloading: boolean;
}

/**
 * Default backend state where all operations are inactive.
 */
const initialBackendResponseLog: BackendResponseLog = {
  imageIsUploading: false,
  maskIsUploading: false,
  augmentationIsRunning: false,
  deletingImages: false,
  deletingMasks: false,
  deletingStratDataFile: false,
  isResetting: false,
  isShuttingDown: false,
  isDownloading: false,
};

/**
 * Zustand store interface for managing backend operation flags.
 */
export interface BackendResponseStore {
  backendResponseLog: BackendResponseLog;

  /**
   * Updates a specific backend response flag (e.g. imageIsUploading, isDownloading).
   * @param key - The name of the flag to update.
   * @param value - The new boolean value for the flag.
   */
  setBackendResponseLog: <K extends keyof BackendResponseLog>(
    key: K,
    value: BackendResponseLog[K]
  ) => void;

  /**
   * Resets all backend flags to their initial inactive state.
   */
  resetBackendResponseLog: () => void;
}

/**
 * Zustand store for tracking backend request and processing states.
 * Used for UI loading indicators, status messages, and controlling actions.
 */
const useBackendResponseStore = create<BackendResponseStore>()(
  (
    set: (
      fn: (state: BackendResponseStore) => Partial<BackendResponseStore>
    ) => void
  ) => ({
    backendResponseLog: initialBackendResponseLog,

    setBackendResponseLog: <K extends keyof BackendResponseLog>(
      key: K,
      value: BackendResponseLog[K]
    ) =>
      set((store: BackendResponseStore) => ({
        backendResponseLog: { ...store.backendResponseLog, [key]: value },
      })),

    resetBackendResponseLog: () =>
      set(() => ({
        backendResponseLog: initialBackendResponseLog,
      })),
  })
);

export default useBackendResponseStore;
