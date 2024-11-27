import { create } from "zustand";

interface AugmentedData {
  filename: string;
  path: string;
  data: BinaryData;
}

interface AugmentedResponse {
  images: AugmentedData[];
  masks: AugmentedData[];
  config: string[];
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
