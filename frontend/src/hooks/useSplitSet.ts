import useTestingSet from "./useTestSet";
import useTrainingSet from "./useTrainingSet";
import useValidationSet from "./useValidationSet";

const useSplitSet = (splitName: string) => {
  const trainingSet = useTrainingSet();
  const validationSet = useValidationSet();
  const testingSet = useTestingSet();

  // Return the appropriate result based on splitName
  if (splitName === "train") {
    return trainingSet;
  } else if (splitName === "val") {
    return validationSet;
  } else {
    return testingSet;
  }
};

export default useSplitSet;
