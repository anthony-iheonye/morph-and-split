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
}

const useAugResponseStore = create<AugmentedResponseStore>((set) => ({
  augmentedResponse: null,
  setAugmentedResponse: (data) => set({ augmentedResponse: data }),
}));

export default useAugResponseStore;
