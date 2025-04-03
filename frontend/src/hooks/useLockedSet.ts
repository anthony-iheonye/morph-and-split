import { AugConfigStore, useAugConfigStore } from "../store";

/**
 * Custom hook to access and update the lock status of the train/val/test split ratios.
 *
 * This hook pulls the current locked states from the augmentation config store
 * and provides the `setAugConfig` method for toggling them.
 *
 * Useful for implementing ratio locking logic in the UI.
 *
 * @returns An object containing:
 *  - `trainRatioLocked`
 *  - `valRatioLocked`
 *  - `testRatioLocked`
 *  - `setAugConfig`: function to update config state
 */
const useLockedRatio = () => {
  const { trainRatioLocked, valRatioLocked, testRatioLocked, setAugConfig } =
    useAugConfigStore((store: AugConfigStore) => ({
      trainRatioLocked: store.augConfig.trainRatioLocked,
      valRatioLocked: store.augConfig.valRatioLocked,
      testRatioLocked: store.augConfig.testRatioLocked,
      setAugConfig: store.setAugConfig,
    }));

  return { trainRatioLocked, valRatioLocked, testRatioLocked, setAugConfig };
};

export default useLockedRatio;
