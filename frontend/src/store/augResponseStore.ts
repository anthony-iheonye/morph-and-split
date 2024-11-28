import { create } from "zustand";
import AugmentedData from "../entities/AugmentData";

export interface AugmentedResponse {
  images: AugmentedData[];
  masks: AugmentedData[];
  config: string[];
  zipPath: string | null;
}

interface AugmentedResponseStore {
  augmentedResponse: AugmentedResponse | null;
  setAugmentedResponse: (augResponse: AugmentedResponse | null) => void;
  resetAugmentedResponse: () => void;
}

const initialAugmentedResponse: AugmentedResponse | null = null;

const useAugResponseStore = create<AugmentedResponseStore>((set) => ({
  augmentedResponse: initialAugmentedResponse,
  setAugmentedResponse: (data) => set({ augmentedResponse: data }),
  resetAugmentedResponse: () =>
    set({ augmentedResponse: initialAugmentedResponse }),
}));

export default useAugResponseStore;
