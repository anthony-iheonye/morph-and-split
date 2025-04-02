import { create } from "zustand";

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
export interface BackendResponseStore {
  backendResponseLog: BackendResponseLog;
  setBackendResponseLog: <K extends keyof BackendResponseLog>(
    key: K,
    value: BackendResponseLog[K]
  ) => void;
  resetBackendResponseLog: () => void;
}

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
