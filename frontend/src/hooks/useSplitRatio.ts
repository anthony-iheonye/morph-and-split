import { useAugConfigStore } from "../store";

const useSplitRatio = () => {
  const { trainRatio, valRatio, testRatio, setRatios } = useAugConfigStore(
    (store) => ({
      trainRatio: store.augConfig.trainRatio,
      valRatio: store.augConfig.valRatio,
      testRatio: store.augConfig.testRatio,
      setRatios: store.setRatios,
    })
  );

  return { trainRatio, valRatio, testRatio, setRatios };
};

export default useSplitRatio;
