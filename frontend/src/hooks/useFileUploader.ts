import { UseToastOptions } from "@chakra-ui/react";
import { sortByName } from "../services";
import { BackendResponseLog } from "../store";
import useAugConfigAndSetter from "./useAugConfigAndSetter";

/**
 * A custom hook to handle file uploads with validation and state management.
 *
 * This hook provides a utility for validating file types, managing the upload state,
 * and handling file selection errors. It delegates the actual upload or processing
 * logic to a provided callback function, allowing for flexibility and reusability.
 *
 * @template T - The type of files being uploaded. Must extend `File`.
 * @param setFilePaths - A callback function that handles the valid files after validation.
 *                       The function should accept an array of files and return a Promise.
 *                       Typically used to perform file uploads or other file-related operations.
 *
 * @returns {object} - An object containing:
 *   - `error` (string | null): The current error message, if any.
 *   - `isUploading` (boolean): Indicates whether an upload operation is in progress.
 *   - `handleFileChange` (function): The event handler for file input changes. It validates
 *     the selected files and invokes the `setFilePaths` callback with the valid files.
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
    return null; // Return null if it's not one of the accepted extensions
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

    // Convert FileList to Array and sort it alphabetically by file name
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
        return; // Stop processing further files
      } else {
        validFiles.push(file as T);
      }
    }

    // Upload files
    try {
      setBackendResponseLog(dataIsUploading, true);
      await setFilePaths(validFiles);
      toast({
        title: "Upload Successful",
        description: `${validFiles.length} file(s) uploaded successfully.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
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
