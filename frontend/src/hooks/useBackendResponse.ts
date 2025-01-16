import { useBackendResponseStore } from "../store";

const useBackendResponse = () => {
  const {
    augmentationIsComplete,
    backendResponseLog,
    imageUploaded,
    maskUploaded,
    imageMaskCountIsEqual,
    setBackendResponseLog,
  } = useBackendResponseStore((store) => ({
    setBackendResponseLog: store.setBackendResponseLog,
    augmentationIsComplete: store.backendResponseLog.augmentationIsComplete,
    imageUploaded: store.backendResponseLog.imageUploaded,
    maskUploaded: store.backendResponseLog.maskUploaded,
    imageMaskCountIsEqual: store.backendResponseLog.imageMaskCountIsEqual,
    backendResponseLog: store.backendResponseLog,
  }));

  return {
    augmentationIsComplete,
    backendResponseLog,
    imageUploaded,
    maskUploaded,
    imageMaskCountIsEqual,
    setBackendResponseLog,
  };
};

export default useBackendResponse;
