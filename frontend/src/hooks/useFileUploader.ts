import { useState } from "react";
import sortByName from "../services/sortByName";

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
  setFilePaths: (files: T[]) => Promise<void>
) => {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setUploading] = useState<boolean>(false);

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
      setError("No file currently selected for upload.");
      return;
    }

    // Convert FileList to Array and sort it alphabetically by file name
    const sortedFiles = sortByName(Array.from(curFiles), (file) => file.name);

    const validFiles: T[] = [];

    for (const file of sortedFiles) {
      const extension = getFileExt(file);

      if (!extension) {
        setError(
          `File name "${file.name}": Not a valid file type. Update your selection.`
        );
        setFilePaths([]);
        return; // Stop processing further files
      } else validFiles.push(file as T);
    }

    setError(null); //clear any previous errors.

    // Upload files
    try {
      setUploading(true);
      await setFilePaths(validFiles);
    } catch (uploadError) {
      setError(`Upload failed: ${(uploadError as Error).message}`);
    } finally {
      setUploading(false);
    }
  };
  return { error, isUploading, handleFileChange };
};

export default useFileUploader;
