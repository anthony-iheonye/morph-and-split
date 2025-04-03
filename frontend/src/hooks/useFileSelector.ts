import { useState } from "react";
import { AugImage, AugMask } from "../entities";
import { sortByName } from "../services";

/**
 * Custom hook to handle file input selection for image or mask files.
 *
 * Features:
 * - Filters valid `.jpg`, `.jpeg`, and `.png` files.
 * - Sorts files alphabetically using `sortByName`.
 * - Converts files to objects containing metadata (`id`, `name`, `url`, etc.).
 * - Automatically generates blob URLs for preview.
 * - Tracks and returns any file validation error.
 *
 * @template T - Must extend either `AugImage` or `AugMask`.
 * @param setFilePaths - Setter to update state with valid parsed file objects.
 * @param onError - Optional callback to propagate error messages externally.
 * @returns Object containing `error` message and `handleFileChange` handler.
 */
const useFileSelector = <T extends AugImage | AugMask>(
  setFilePaths: (files: T[]) => void,
  onError?: (error: string | null) => void
) => {
  const [error, setErrorState] = useState<string | null>(null);

  const setError = (error: string | null) => {
    setErrorState(error);
    if (onError) onError(error);
  };

  /**
   * Validates the file extension and returns it if acceptable.
   */
  const getFileExt = (file: File): T["extension"] | null => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "png" || ext === "jpeg") {
      return ext;
    }
    return null;
  };

  /**
   * Handles the file input change event.
   * Validates file types, generates preview URLs, and sets structured file objects.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const curFiles = event.target.files;

    if (!curFiles || curFiles.length == 0) {
      setError("No file currently selected for upload.");
      return;
    }

    const sortedFiles = sortByName(Array.from(curFiles), (file) => file.name);
    const newFiles: T[] = [];

    for (const file of sortedFiles) {
      const extension = getFileExt(file);

      if (!extension) {
        setError(
          `File name "${file.name}": Not a valid file type. Update your selection.`
        );
        setFilePaths([]);
        return;
      } else {
        newFiles.push({
          id: file.name,
          name: file.name,
          extension: extension,
          url: URL.createObjectURL(file),
          file: file,
        } as T);
      }
    }

    setError(null);
    setFilePaths(newFiles);
  };

  return { error, handleFileChange };
};

export default useFileSelector;
