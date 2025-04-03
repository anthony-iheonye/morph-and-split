import { ChangeEvent, useState } from "react";
import { getFileExt } from "../services";
import useAugConfigAndSetter from "./useAugConfigAndSetter";

/**
 * Custom hook for handling the upload of a visual attribute CSV file
 * used for stratified splitting in the Morph and Split app.
 *
 * - Validates file type to ensure it is a `.csv`
 * - Updates the augmentation config with the selected file
 * - Tracks error state if file selection is invalid
 *
 * @returns Object containing the `error`, `handleFileChange` handler, and `augConfig`
 */
const useVisualAttributesFile = () => {
  const [error, setError] = useState<string | null>(null);
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  /**
   * Handles input file selection for visual attribute CSV.
   *
   * @param event - Change event from the file input element
   */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const curFiles = event.target.files;
    const previousFile = augConfig.stratificationDataFile?.name || "";

    // Validate file extension
    if (curFiles && getFileExt(curFiles[0]) !== "csv") {
      setError(`File must be in CSV format. Selected ${curFiles[0].name}`);
      return;
    }

    // Handle no file selected
    if (!curFiles || (curFiles.length === 0 && previousFile === "")) {
      setError("No file was selected.");
      return;
    }

    setError(null);
    const result = Array.from(curFiles)[0];

    // Update augmentation config with the selected file
    setAugConfig("stratificationDataFile", {
      name: result.name,
      file: result,
    });
  };

  return { error, handleFileChange, augConfig };
};

export default useVisualAttributesFile;
