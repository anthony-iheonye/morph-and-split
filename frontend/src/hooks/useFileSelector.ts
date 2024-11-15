import { useState } from "react";
import AugImage from "../entities/Image";
import AugMask from "../entities/Mask";

const useFileSelector = (
  setFilePaths: (files: AugImage[] | AugMask[]) => void
) => {
  const [error, setError] = useState<String | null>(null);

  const getFileExt = (file: File): AugImage["extension"] | null => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "png" || ext === "jpeg") {
      return ext;
    }
    return null; // Return null if it's not one of the accepted extensions
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const curFiles = event.target.files;

    if (!curFiles || curFiles.length == 0) {
      setError("No files currently selected for upload.");
      // setFilePaths([]);  // reset current state if no new file is selected.
      return;
    }

    setError(null);
    const newFiles: AugImage[] = [];

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
        });
    }

    setFilePaths(newFiles);
  };
  return { error, handleFileChange };
};

export default useFileSelector;
