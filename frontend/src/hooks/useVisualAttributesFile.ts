import { ChangeEvent, useState } from "react";
import { getFileExt } from "../fileUtils";
import useAugConfigAndSetter from "./useAugConfigAndSetter";

const useVisualAttributesFile = () => {
  const [error, setError] = useState<string | null>(null);
  const { augConfig, setAugConfig } = useAugConfigAndSetter();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const curFiles = event.target.files;
    const previousFile = augConfig.visualAttributesJSONFile?.name || "";

    if (curFiles && getFileExt(curFiles[0]) !== "csv") {
      setError(`Files most be in JSON format. Selected ${curFiles[0].name}`);
      return;
    }

    if (!curFiles || (curFiles.length == 0 && previousFile === "")) {
      setError("No file on visual attribute was selected.");
      return;
    }

    setError(null);
    const result = Array.from(curFiles)[0];

    setAugConfig("visualAttributesJSONFile", {
      name: result.name,
      file: result,
    });
  };

  return { error, handleFileChange, augConfig };
};

export default useVisualAttributesFile;
