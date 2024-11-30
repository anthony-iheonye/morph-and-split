import { create } from "zustand";

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
