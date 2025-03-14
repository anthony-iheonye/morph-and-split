import { create, StateCreator } from "zustand";
import AugImage from "../entities/AugImage";
import AugMask from "../entities/AugMask";
import CropDimension from "../entities/CropDimension";
import ImgDimension from "../entities/ImgDimension";
import ImgMaskChannels from "../entities/ImgMaskChannels";
import StratificationDataFile from "../entities/VisualAttributeFile";

export interface AugConfig {
  initialTrainSaveId?: number;
  initialValSaveId?: number;
  initialTestSaveId?: number;
  stratificationDataFile?: StratificationDataFile;
  splitParameter: string;
  splitParameters: string[];
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
  imageType?: string;
  reset?: boolean;
}

export interface AugConfigStore {
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
  stratificationDataFile: { name: "", file: null },
  splitParameter: "",
  splitParameters: [],
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
  imageType: "",
  reset: false,
};

const useAugConfigStore = create<AugConfigStore>(((set) => ({
  augConfig: initialAugConfig,
  previewSelection: false,
  previewAugmentedResult: false,

  setPreviewSelection: (previewSelection: boolean) =>
    set(() => ({ previewSelection })),

  setPreviewAugmentedResult: (previewAugmentedResult: boolean) =>
    set(() => ({ previewAugmentedResult })),

  setAugmentedImages: (augmentedImages: AugImage[]) =>
    set((store: AugConfigStore) => ({
      augConfig: { ...store.augConfig, augmentedImages },
    })),

  setAugmentedMasks: (augmentedMasks: AugMask[]) =>
    set((store: AugConfigStore) => ({
      augConfig: { ...store.augConfig, augmentedMasks },
    })),

  setAugConfig: <K extends keyof AugConfig>(key: K, value: AugConfig[K]) =>
    set((store: AugConfigStore) => ({
      augConfig: { ...store.augConfig, [key]: value },
    })),

  setRatios: (train: number, val: number, test: number) =>
    set((store: AugConfigStore) => ({
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
})) as StateCreator<AugConfigStore>);

export default useAugConfigStore;
