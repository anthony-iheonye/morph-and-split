import { AugConfigStore, useAugConfigStore } from "../store";

/**
 * Custom hook to access and update the full augmentation configuration state.
 *
 * Provides:
 * - `augConfig`: The full augmentation config object from Zustand.
 * - `setAugConfig`: A method to update a specific key in the config.
 * - `resetAugConfig`: A method to reset the config to its initial state.
 *
 * @returns Object containing `augConfig`, `setAugConfig`, and `resetAugConfig`.
 */
const useAugConfigAndSetter = () => {
  const { augConfig, setAugConfig, resetAugConfig } = useAugConfigStore(
    (store: AugConfigStore) => ({
      augConfig: store.augConfig,
      setAugConfig: store.setAugConfig,
      resetAugConfig: store.resetAugConfig,
    })
  );

  return { augConfig, setAugConfig, resetAugConfig };
};

export default useAugConfigAndSetter;
