import useBackendResponseStore from "../store/backendResponseStore";

const useBackendResponse = () => {
  const { augmentationIsComplete, setBackedResponseLog } =
    useBackendResponseStore((store) => ({
      setBackedResponseLog: store.setBackendResponseLog,
      augmentationIsComplete: store.backendResponseLog.augmentationIsComplete,
    }));

  return { augmentationIsComplete, setBackedResponseLog };
};

export default useBackendResponse;
