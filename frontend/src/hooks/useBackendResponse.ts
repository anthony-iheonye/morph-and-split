import { useBackendResponseStore } from "../store";

const useBackendResponse = () => {
  const { augmentationIsComplete, setBackendResponseLog } =
    useBackendResponseStore((store) => ({
      setBackendResponseLog: store.setBackendResponseLog,
      augmentationIsComplete: store.backendResponseLog.augmentationIsComplete,
    }));

  return { augmentationIsComplete, setBackendResponseLog };
};

export default useBackendResponse;
