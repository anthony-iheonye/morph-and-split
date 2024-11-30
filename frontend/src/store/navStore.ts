import { create } from "zustand";

export const parentNames = {
  uploadImageAndMask: "uploadImageAndMask",
  augmentationConfig: "augmentationConfig",
  augment: "augment",
};

export const subParentNames = {
  uploadImages: "uploadImages",
  uploadMasks: "uploadMasks",
  previewUpload: "previewUpload",
  dataSplit: "dataSplit",
  transformation: "transformation",
  visualAtttributes: "visualAttributes",
  preProcessing: "preprocessing",
  startAugmentation: "startAugmentation",
  previewResult: "previewResult",
};

interface NavStore {
  activeParent: string | null;
  activeSubParent: string | null;
  setActiveParent: (activeParent: string) => void;
  setActiveSubParent: (activeSubParent: string) => void;
}

const useNavStore = create<NavStore>((set) => ({
  activeParent: null,
  activeSubParent: null,
  setActiveParent: (parent) =>
    set({ activeParent: parent, activeSubParent: null }),
  setActiveSubParent: (subParent) => set({ activeSubParent: subParent }),
}));

export default useNavStore;
