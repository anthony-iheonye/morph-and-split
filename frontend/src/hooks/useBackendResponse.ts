import { useBackendResponseStore } from "../store";

const useBackendResponse = () => {
  const {
    imageIsUploading,
    maskIsUploading,
    backendResponseLog,
    setBackendResponseLog,
  } = useBackendResponseStore((store) => ({
    imageIsUploading: store.backendResponseLog.imageIsUploading,
    maskIsUploading: store.backendResponseLog.maskIsUploading,
    backendResponseLog: store.backendResponseLog,
    setBackendResponseLog: store.setBackendResponseLog,
  }));

  return {
    imageIsUploading,
    maskIsUploading,
    backendResponseLog,
    setBackendResponseLog,
  };
};

export default useBackendResponse;
