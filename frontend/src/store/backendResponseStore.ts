import { create } from "zustand";

interface BackendResponseLog {
  augmentationIsComplete?: Boolean;
  imageUploaded?: Boolean;
  maskUploaded?: Boolean;
  uploadedImagesCount?: number;
  uploadedMasksCount?: number;
  imageMaskCountIsEqual?: Boolean;
}

const initialBackendResponseLog: BackendResponseLog = {
  augmentationIsComplete: false,
  imageUploaded: false,
  maskUploaded: false,
  uploadedImagesCount: 0,
  uploadedMasksCount: 0,
  imageMaskCountIsEqual: false,
};
interface BackendResponseStore {
  backendResponseLog: BackendResponseLog;
  setBackendResponseLog: <K extends keyof BackendResponseLog>(
    key: K,
    value: BackendResponseLog[K]
  ) => void;
  resetBackendResponseLog: () => void;
}

const useBackendResponseStore = create<BackendResponseStore>((set) => ({
  backendResponseLog: initialBackendResponseLog,
  setBackendResponseLog: (key, value) =>
    set((store) => ({
      backendResponseLog: { ...store.backendResponseLog, [key]: value },
    })),
  resetBackendResponseLog: () =>
    set(() => ({
      backendResponseLog: initialBackendResponseLog,
    })),
}));

export default useBackendResponseStore;
