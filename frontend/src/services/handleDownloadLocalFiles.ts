import { BackendResponseLog } from "../store";
import { baseURL } from "./api-client";
import handleDownloadBlob from "./handleDownloadBlob";

/**
 * Downloads files stored locally on the backend (not in GCS).
 *
 * This function:
 * 1. Constructs download URLs for each requested filename.
 * 2. Fetches each file directly from the backend server.
 * 3. Converts each response to a Blob and triggers the download.
 *
 * @param filenames - Array of filenames to download from the local backend.
 * @param setBackendResponseLog - Zustand setter for the "isDownloading" backend state flag.
 */
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
      // Construct full backend URL to the file
      const url = `${baseURL}/download/augmentation_results/${encodeURIComponent(
        filename
      )}`;

      // Fetch the file from the server
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to fetch the file: ${filename}`);

      // Convert response to a Blob
      const blob = await response.blob();

      // Trigger the download
      handleDownloadBlob(blob, filename);
    }
  } catch (error) {
    console.error(`Failed to download the file ${filenames[0]}: `, error);
  } finally {
    setBackendResponseLog("isDownloading", false);
  }
};

export default handleDownloadLocalFiles;
