import { UseToastOptions } from "@chakra-ui/react";
import { sortByName } from "../services";
import { BackendResponseLog } from "../store";
import useAugConfigAndSetter from "./useAugConfigAndSetter";

/**
 * A custom hook to handle file uploads with validation and state management.
 *
 * This hook:
 * - Validates file types (`.jpg`, `.jpeg`, `.png`)
 * - Sorts files alphabetically
 * - Notifies via toast on success or failure
 * - Sets upload state flags using Zustand
 * - Supports image type detection and setting
 *
 * @template T - The type of files being uploaded. Must extend `File`.
 *
 * @param setFilePaths - Async function to handle valid files (e.g., upload to server).
 * @param toast - Function to show toast notifications.
 * @param setBackendResponseLog - Zustand setter for backend operation flags.
 * @param dataIsUploading - A key of `BackendResponseLog` indicating which upload flag to toggle.
 *
 * @returns An object with:
 *   - `handleFileChange`: Input change handler to trigger validation and upload.
 */
const useFileUploader = <T extends File>(
  setFilePaths: (files: T[]) => Promise<void>,
  toast: (options: UseToastOptions) => void,
  setBackendResponseLog: <K extends keyof BackendResponseLog>(
    key: K,
    value: BackendResponseLog[K]
  ) => void,
  dataIsUploading: "imageIsUploading" | "maskIsUploading"
) => {
  const { setAugConfig } = useAugConfigAndSetter();

  const getFileExt = (file: File): "png" | "jpeg" | "jpg" | null => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "png" || ext === "jpeg") {
      return ext;
    }
    return null;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const curFiles = event.target.files;

    if (!curFiles || curFiles.length == 0) {
      toast({
        title: "No File Selected",
        description: "Please select at least one file to upload.",
        status: "error",
        duration: 40000,
        isClosable: true,
      });
      return;
    }

    const sortedFiles = sortByName(Array.from(curFiles), (file) => file.name);
    const validFiles: T[] = [];

    setAugConfig("imageType", `image/${getFileExt(sortedFiles[0])}`);

    for (const file of sortedFiles) {
      const extension = getFileExt(file);

      if (!extension) {
        toast({
          title: "Invalid File Format",
          description: `File "${file.name}" is not a valid format (only jpg, jpeg, png allowed).`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      } else {
        validFiles.push(file as T);
      }
    }

    try {
      setBackendResponseLog(dataIsUploading, true);
      await setFilePaths(validFiles);
    } catch (uploadError) {
      toast({
        title: "Upload Failed",
        description: `Error: ${(uploadError as Error).message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setBackendResponseLog(dataIsUploading, false);
    }
  };

  return { handleFileChange };
};

export default useFileUploader;
