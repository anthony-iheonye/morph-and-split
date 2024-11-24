import { useState } from "react";
import AugImage from "../entities/Image";
import AugMask from "../entities/Mask";

const useFileSelector = <T extends AugImage | AugMask>(
  setFilePaths: (files: T[]) => void,
  onError?: (error: string | null) => void
) => {
  const [error, setErrorState] = useState<string | null>(null);

  const setError = (error: string | null) => {
    setErrorState(error);
    if (onError) onError(error);
  };

  const getFileExt = (file: File): T["extension"] | null => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "png" || ext === "jpeg") {
      return ext;
    }
    return null; // Return null if it's not one of the accepted extensions
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const curFiles = event.target.files;

    if (!curFiles || curFiles.length == 0) {
      setError("No file currently selected for upload.");
      return;
    }

    const newFiles: T[] = [];

    for (const file of Array.from(curFiles)) {
      const extension = getFileExt(file);

      if (!extension) {
        setError(
          `File name "${file.name}": Not a valid file type. Update your selection.`
        );
        setFilePaths([]);
        return; // Stop processing further files
      } else
        newFiles.push({
          id: file.name,
          name: file.name,
          extension: extension,
          url: URL.createObjectURL(file),
          file: file,
        } as T);
    }

    setError(null); //clear any previous errors.
    setFilePaths(newFiles);
  };
  return { error, handleFileChange };
};

export default useFileSelector;
