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
  setImages: (images: AugImage[]) => void;
  setMasks: (masks: AugMask[]) => void;
  setSaveDirectory: (saveDirectory: string) => void;
  setInitialTrainSaveId: (initialTrainSaveId: number) => void;
  setInitialValSaveId: (initialValSaveId: number) => void;
  setInitialTestSaveId: (initialTestSaveId: number) => void;
  setVisualAttributesJSONFile: (visualAttributesJSONFile: string) => void;
  setImageMaskChannels: (imageMaskChannels: ImgMaskChannels) => void;
  setAugImageDimension: (augImageDimension: ImgDimension) => void;
  setValSize: (valSize: number) => void;
  setTestSize: (testSize: number) => void;
  setSeed: (seed: number) => void;
  setCrop: (crop: boolean) => void;
  setCropDimension: (cropDimension: CropDimension) => void;
  setAugmentValData: (augmentValData: boolean) => void;
  setRandomCrop: (randomCrop: boolean) => void;
  setFlipLeftRight: (flipLeftRight: boolean) => void;
  setFlipUpDown: (flipUpDown: boolean) => void;
  setRandomRotate: (randomRotate: boolean) => void;
  setCorruptBrightness: (corruptBrightness: boolean) => void;
  setCorruptContrast: (corruptContrast: boolean) => void;
  setCorruptSaturation: (corruptSaturation: boolean) => void;
  setCacheDirectory: (cacheDirectory: string) => void;
  setTotalAugmentedImages: (totalAugmentedImages: number) => void;
}

const useAugConfigStore = create<AugConfigStore>((set) => ({
  augConfig: {},
  previewSelection: false,
  setPreviewSelection: (previewSelection) => set(() => ({ previewSelection })),
  setImages: (images) =>
    set((store) => ({ augConfig: { ...store.augConfig, images } })),
  setMasks: (masks) =>
    set((store) => ({ augConfig: { ...store.augConfig, masks } })),
  setSaveDirectory: (saveDirectory) =>
    set((store) => ({ augConfig: { ...store.augConfig, saveDirectory } })),
  setInitialTrainSaveId: (initialTrainSaveId) =>
    set((store) => ({
      augConfig: { ...store.augConfig, initialTrainSaveId },
    })),
  setInitialValSaveId: (initialValSaveId) =>
    set((store) => ({ augConfig: { ...store.augConfig, initialValSaveId } })),
  setInitialTestSaveId: (initialTestSaveId) =>
    set((store) => ({
      augConfig: { ...store.augConfig, initialTestSaveId },
    })),
  setVisualAttributesJSONFile: (visualAttributesJSONFile) =>
    set((store) => ({
      augConfig: { ...store.augConfig, visualAttributesJSONFile },
    })),
  setImageMaskChannels: (imgMaskChannels) =>
    set((store) => ({
      augConfig: { ...store.augConfig, imgMaskChannels },
    })),
  setAugImageDimension: (augImageDimension) =>
    set((store) => ({
      augConfig: { ...store.augConfig, augImageDimension },
    })),
  setValSize: (valSize) =>
    set((store) => ({ augConfig: { ...store.augConfig, valSize } })),
  setTestSize: (testSize) =>
    set((store) => ({ augConfig: { ...store.augConfig, testSize } })),
  setSeed: (seed) =>
    set((store) => ({ augConfig: { ...store.augConfig, seed } })),
  setCrop: (crop) =>
    set((store) => ({ augConfig: { ...store.augConfig, crop } })),
  setCropDimension: (cropDimension) =>
    set((store) => ({ augConfig: { ...store.augConfig, cropDimension } })),
  setAugmentValData: (augmentValData) =>
    set((store) => ({ augConfig: { ...store.augConfig, augmentValData } })),
  setRandomCrop: (randomCrop) =>
    set((store) => ({ augConfig: { ...store.augConfig, randomCrop } })),
  setFlipLeftRight: (flipLeftRight) =>
    set((store) => ({ augConfig: { ...store.augConfig, flipLeftRight } })),
  setFlipUpDown: (flipUpDown) =>
    set((store) => ({ augConfig: { ...store.augConfig, flipUpDown } })),
  setRandomRotate: (randomRotate) =>
    set((store) => ({ augConfig: { ...store.augConfig, randomRotate } })),
  setCorruptBrightness: (corruptBrightness) =>
    set((store) => ({
      augConfig: { ...store.augConfig, corruptBrightness },
    })),
  setCorruptContrast: (corruptContrast) =>
    set((store) => ({ augConfig: { ...store.augConfig, corruptContrast } })),
  setCorruptSaturation: (corruptSaturation) =>
    set((store) => ({
      augConfig: { ...store.augConfig, corruptSaturation },
    })),
  setCacheDirectory: (cacheDirectory) =>
    set((store) => ({ augConfig: { ...store.augConfig, cacheDirectory } })),
  setTotalAugmentedImages: (totalAugmentedImages) =>
    set((store) => ({
      augConfig: { ...store.augConfig, totalAugmentedImages },
    })),
}));

export default useAugConfigStore;
