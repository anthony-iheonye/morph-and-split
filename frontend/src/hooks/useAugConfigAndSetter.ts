import { useAugConfigStore } from "../store";

const useAugConfigAndSetter = () => {
  const { augConfig, setAugConfig, resetAugConfig } = useAugConfigStore(
    (store) => ({
      augConfig: store.augConfig,
      setAugConfig: store.setAugConfig,
      resetAugConfig: store.resetAugConfig,
    })
  );
  return { augConfig, setAugConfig, resetAugConfig };
};

export default useAugConfigAndSetter;
