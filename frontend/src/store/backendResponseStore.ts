import { create } from "zustand";

interface BackendResponseLog {
  augmentationIsComplete: Boolean;
}

const initialBackendResponseLog: BackendResponseLog = {
  augmentationIsComplete: false,
};
interface BackendResponseStore {
  backendResponseLog: BackendResponseLog;
  setBackendResponseLog: <K extends keyof BackendResponseLog>(
    key: K,
    value: BackendResponseLog[K]
  ) => void;
}

const useBackendResponseStore = create<BackendResponseStore>((set) => ({
  backendResponseLog: initialBackendResponseLog,
  setBackendResponseLog: (key, value) =>
    set((store) => ({
      backendResponseLog: { ...store.backendResponseLog, [key]: value },
    })),
}));

export default useBackendResponseStore;
