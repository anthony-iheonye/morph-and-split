import { useBackendResponseStore } from "../store";

const useBackendResponse = () => {
  const {
    imageIsUploading,
    maskIsUploading,
    backendResponseLog,
    setBackendResponseLog,
    resetBackendResponseLog,
  } = useBackendResponseStore((store) => ({
    imageIsUploading: store.backendResponseLog.imageIsUploading,
    maskIsUploading: store.backendResponseLog.maskIsUploading,
    backendResponseLog: store.backendResponseLog,
    setBackendResponseLog: store.setBackendResponseLog,
    resetBackendResponseLog: store.resetBackendResponseLog,
  }));

  return {
    imageIsUploading,
    maskIsUploading,
    backendResponseLog,
    setBackendResponseLog,
    resetBackendResponseLog,
  };
};

export default useBackendResponse;
