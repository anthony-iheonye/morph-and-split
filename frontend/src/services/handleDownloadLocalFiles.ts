import { BackendResponseLog } from "../store";
import { baseURL } from "./api-client";

import handleDownloadBlob from "./handleDownloadBlob";

const handleDownloadLocalFiles = async (
  filenames: string[],
  setBackendResponseLog: <K extends keyof BackendResponseLog>(
    key: K,
    value: BackendResponseLog[K]
  ) => void
) => {
  try {
    setBackendResponseLog("isDownloading", true);

    for (const filename of filenames) {
      // construct full download url
      const url = `${baseURL}/download/augmentation_results/${encodeURIComponent(
        filename
      )}`;

      // fetch file from server
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to fetch the file: ${filename}`);

      // convert response to blob
      const blob = await response.blob();

      // Trigger file download
      handleDownloadBlob(blob, filename);
    }
    // await localDownloadAPI.downloadLocalFiles(filenames);
  } catch (error) {
    console.error(`Failed to download the file ${filenames[0]}: `, error);
  } finally {
    setBackendResponseLog("isDownloading", false);
  }
};

export default handleDownloadLocalFiles;
