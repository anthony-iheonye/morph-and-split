import { create } from "zustand";
import CropDimension from "./entities/CropDimension";
import AugImage from "./entities/Image";
import ImgDimension from "./entities/ImgDimension";
import ImgMaskChannels from "./entities/ImgMaskChannels";
import AugMask from "./entities/Mask";
import VisualAttributeJSONFile from "./entities/VisualAttributeFile";

interface AugConfig {
  images?: AugImage[];
  masks?: AugMask[];
  saveDirectory?: string;
  initialTrainSaveId?: number;
  initialValSaveId?: number;
  initialTestSaveId?: number;
  visualAttributesJSONFile?: VisualAttributeJSONFile;
  imageMaskChannels?: ImgMaskChannels;
  augImageDimension?: ImgDimension;
  resizeAugImage: boolean;
  trainRatio: number;
  valRatio: number;
  testRatio: number;
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
  setRatios: (train: number, val: number, test: number) => void;
}

const useAugConfigStore = create<AugConfigStore>((set) => ({
  augConfig: {
    images: [],
    masks: [],
    saveDirectory: "",
    initialTrainSaveId: 1,
    initialValSaveId: 1,
    initialTestSaveId: 1,
    visualAttributesJSONFile: { name: "", url: "" },
    imageMaskChannels: { imgChannels: 3, maskChannels: 1 },
    resizeAugImage: false,
    augImageDimension: { width: 1200, height: 800 },
    trainRatio: 0.6,
    valRatio: 0.2,
    testRatio: 0.2,
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
  },
  previewSelection: false,
  setPreviewSelection: (previewSelection) => set(() => ({ previewSelection })),
  setImages: (images) =>
    set((store) => ({ augConfig: { ...store.augConfig, images } })),
  setMasks: (masks) =>
    set((store) => ({ augConfig: { ...store.augConfig, masks } })),
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
}));

export default useAugConfigStore;
