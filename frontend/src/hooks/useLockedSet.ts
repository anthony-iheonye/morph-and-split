import { useAugConfigStore } from "../store";

const useLockedRatio = () => {
  const { trainRatioLocked, valRatioLocked, testRatioLocked, setAugConfig } =
    useAugConfigStore((store) => ({
      trainRatioLocked: store.augConfig.trainRatioLocked,
      valRatioLocked: store.augConfig.valRatioLocked,
      testRatioLocked: store.augConfig.testRatioLocked,
      setAugConfig: store.setAugConfig,
    }));

  return { trainRatioLocked, valRatioLocked, testRatioLocked, setAugConfig };
};

export default useLockedRatio;
