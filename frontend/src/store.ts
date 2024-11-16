import { create } from "zustand";
import CropDimension from "./entities/CropDimension";
import AugImage from "./entities/Image";
import ImgDimension from "./entities/ImgDimension";
import ImgMaskChannels from "./entities/ImgMaskChannels";
import AugMask from "./entities/Mask";

interface AugConfig {
  images?: AugImage[];
  masks?: AugMask[];
  saveDirectory?: string;
  initialTrainSaveId?: number;
  initialValSaveId?: number;
  initialTestSaveId?: number;
  visualAttributesJSONFile?: string;
  imageMaskChannels?: ImgMaskChannels;
  augImageDimension?: ImgDimension;
  valSize?: number;
  testSize?: number;
  seed?: number;
  crop?: boolean;
  cropDimension?: CropDimension;
  augmentValData?: boolean;
  randomCrop?: boolean;
  flipLeftRight?: boolean;
  flipUpDown?: boolean;
  randomRotate?: boolean;
  corruptBrightness?: boolean;
  corruptContrast?: boolean;
  corruptSaturation?: boolean;
  cacheDirectory?: string;
  totalAugmentedImages?: number;
}

interface AugConfigStore {
  augConfig: AugConfig;
  previewSelection: boolean;
  setPreviewSelection: (previewSelection: boolean) => void;
  setAugConfig: <K extends keyof AugConfig>(
    key: K,
    value: AugConfig[K]
  ) => void;
  setImages: (images: AugImage[]) => void;
  setMasks: (masks: AugMask[]) => void;
}

const useAugConfigStore = create<AugConfigStore>((set) => ({
  augConfig: {
    images: [],
    masks: [],
    saveDirectory: "",
    initialTrainSaveId: 1,
    initialValSaveId: 1,
    initialTestSaveId: 1,
    visualAttributesJSONFile: "",
    imageMaskChannels: { imgChannels: 3, maskChannels: 1 },
    augImageDimension: { width: 256, height: 256 },
    valSize: 0.2,
    testSize: 0.2,
    seed: 42,
    crop: false,
    cropDimension: {
      offsetHeight: 0,
      offsetWidth: 0,
      targetHeight: 0,
      targetWidth: 0,
    },
    augmentValData: false,
    randomCrop: false,
    flipLeftRight: false,
    flipUpDown: false,
    randomRotate: false,
    corruptBrightness: false,
    corruptContrast: false,
    corruptSaturation: false,
    cacheDirectory: "",
    totalAugmentedImages: 150,
  },
  previewSelection: false,
  setPreviewSelection: (previewSelection) => set(() => ({ previewSelection })),
  setImages: (images) =>
    set((store) => ({ augConfig: { ...store.augConfig, images } })),
  setMasks: (masks) =>
    set((store) => ({ augConfig: { ...store.augConfig, masks } })),
  setAugConfig: (key, value) =>
    set((store) => ({ augConfig: { ...store.augConfig, [key]: value } })),
}));

export default useAugConfigStore;
