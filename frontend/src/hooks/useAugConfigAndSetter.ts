import useAugConfigStore from "../store";

const useAugConfigAndSetter = () => {
  const { augConfig, setAugConfig } = useAugConfigStore((store) => ({
    augConfig: store.augConfig,
    setAugConfig: store.setAugConfig,
  }));
  return { augConfig, setAugConfig };
};

export default useAugConfigAndSetter;
