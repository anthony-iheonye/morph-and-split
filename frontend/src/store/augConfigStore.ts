import { create } from "zustand";
import CropDimension from "../entities/CropDimension";
import AugImage from "../entities/AugImage";
import ImgDimension from "../entities/ImgDimension";
import ImgMaskChannels from "../entities/ImgMaskChannels";
import AugMask from "../entities/AugMask";
import VisualAttributeJSONFile from "../entities/VisualAttributeFile";

export interface AugConfig {
  initialTrainSaveId?: number;
  initialValSaveId?: number;
  initialTestSaveId?: number;
  visualAttributesJSONFile?: VisualAttributeJSONFile;
  splitParameter: string;
  imageMaskChannels?: ImgMaskChannels;
  augImageDimension?: ImgDimension;
  resizeAugImage: boolean;
  trainRatio: number;
  valRatio: number;
  testRatio: number;
  trainRatioLocked: boolean;
  valRatioLocked: boolean;
  testRatioLocked: boolean;
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
  totalAugmentedImages?: number;
  eccentricity?: boolean;
  equivalentDiameter?: boolean;
  feretDiameterMax?: boolean;
  filledArea?: boolean;
  perimeter?: boolean;
  roundness?: boolean;
  l?: boolean;
  a?: boolean;
  b?: boolean;
  contrast?: boolean;
  correlation?: boolean;
  energy?: boolean;
  previewedSet?: string;
  reset?: boolean;
}

interface AugConfigStore {
  augConfig: AugConfig;
  previewSelection: boolean;
  previewAugmentedResult: boolean;
  setPreviewSelection: (previewSelection: boolean) => void;
  setPreviewAugmentedResult: (previewAugmentedResult: boolean) => void;
  setAugConfig: <K extends keyof AugConfig>(
    key: K,
    value: AugConfig[K]
  ) => void;
  setAugmentedImages: (augmentedImages: AugImage[]) => void;
  setAugmentedMasks: (augmentedMasks: AugMask[]) => void;
  setRatios: (train: number, val: number, test: number) => void;
  resetAugConfig: () => void;
}

const initialAugConfig: AugConfig = {
  initialTrainSaveId: 1,
  initialValSaveId: 1,
  initialTestSaveId: 1,
  visualAttributesJSONFile: { name: "", file: null },
  splitParameter: "a",
  imageMaskChannels: { imgChannels: 3, maskChannels: 3 },
  resizeAugImage: false,
  augImageDimension: { width: 1024, height: 1024 },
  trainRatio: 0.6,
  valRatio: 0.2,
  testRatio: 0.2,
  trainRatioLocked: false,
  valRatioLocked: false,
  testRatioLocked: false,
  seed: 42,
  crop: false,
  cropDimension: {
    offsetHeight: 1,
    offsetWidth: 1,
    targetHeight: 10,
    targetWidth: 10,
  },
  augmentValData: false,
  randomCrop: false,
  flipLeftRight: false,
  flipUpDown: false,
  randomRotate: false,
  corruptBrightness: false,
  corruptContrast: false,
  corruptSaturation: false,
  totalAugmentedImages: 150,
  eccentricity: false,
  equivalentDiameter: false,
  feretDiameterMax: false,
  filledArea: false,
  perimeter: false,
  roundness: false,
  l: false,
  a: false,
  b: false,
  contrast: false,
  correlation: false,
  energy: false,
  previewedSet: "train",
  reset: false,
};

const useAugConfigStore = create<AugConfigStore>((set) => ({
  augConfig: initialAugConfig,
  previewSelection: false,
  previewAugmentedResult: false,
  setAugConfig2: () => set(() => ({ augConfig: initialAugConfig })),
  setPreviewSelection: (previewSelection) => set(() => ({ previewSelection })),
  setPreviewAugmentedResult: (previewAugmentedResult) =>
    set(() => ({ previewAugmentedResult })),
  setAugmentedImages: (augmentedImages) =>
    set((store) => ({ augConfig: { ...store.augConfig, augmentedImages } })),
  setAugmentedMasks: (augmentedMasks) =>
    set((store) => ({ augConfig: { ...store.augConfig, augmentedMasks } })),
  setAugConfig: (key, value) =>
    set((store) => ({ augConfig: { ...store.augConfig, [key]: value } })),
  setRatios: (train, val, test) =>
    set((store) => ({
      augConfig: {
        ...store.augConfig,
        trainRatio: train,
        valRatio: val,
        testRatio: test,
      },
    })),
  resetAugConfig: () =>
    set(() => ({
      augConfig: initialAugConfig,
      previewAugmentedResult: false,
      previewSelection: false,
    })),
}));

export default useAugConfigStore;
