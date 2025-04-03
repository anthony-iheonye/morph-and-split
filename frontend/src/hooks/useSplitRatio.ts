import { AugConfigStore, useAugConfigStore } from "../store";

/**
 * Custom hook to access and update the data split ratios (train, val, test)
 * from the Zustand augmentation config store.
 *
 * @returns Object containing current ratios and a setter to update them.
 */
const useSplitRatio = () => {
  const { trainRatio, valRatio, testRatio, setRatios } = useAugConfigStore(
    (store: AugConfigStore) => ({
      trainRatio: store.augConfig.trainRatio,
      valRatio: store.augConfig.valRatio,
      testRatio: store.augConfig.testRatio,
      setRatios: store.setRatios,
    })
  );

  return { trainRatio, valRatio, testRatio, setRatios };
};

export default useSplitRatio;
