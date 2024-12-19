import useBackendResponseStore from "../store/backendResponseStore";

const useBackendResponse = () => {
  const {
    augmentationIsComplete,
    setBackendResponseLog: setBackedResponseLog,
  } = useBackendResponseStore((store) => ({
    setBackendResponseLog: store.setBackendResponseLog,
    augmentationIsComplete: store.backendResponseLog.augmentationIsComplete,
  }));

  return { augmentationIsComplete, setBackedResponseLog };
};

export default useBackendResponse;
