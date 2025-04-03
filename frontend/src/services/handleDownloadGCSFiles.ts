import { BackendResponseLog } from "../store";
import APIClient from "./api-client";
import handleDownloadBlob from "./handleDownloadBlob";

/**
 * Downloads files from Google Cloud Storage by:
 * 1. Requesting signed download URLs for the given filenames.
 * 2. Fetching each file using its signed URL.
 * 3. Triggering a download using Blob and a temporary anchor element.
 *
 * @param filenames - Array of filenames to download from GCS.
 * @param setBackendResponseLog - Zustand setter for backend download state flag.
 */
const handleDownloadGCSFiles = async (
  filenames: string[],
  setBackendResponseLog: <K extends keyof BackendResponseLog>(
    key: K,
    value: BackendResponseLog[K]
  ) => void
) => {
  const gcsDownloadAPI = new APIClient<Blob>("/generate-signed-download-url");

  try {
    setBackendResponseLog("isDownloading", true);

    // Get signed download URLs from backend
    const signedUrls = await gcsDownloadAPI.getSignedDownloadUrls(filenames);
    if (!signedUrls.length) throw new Error("No signed URLs found.");

    for (const fileObj of signedUrls) {
      console.log(`Downloading from: ${fileObj.filename}`);

      // Fetch the file using the signed URL
      const response = await fetch(fileObj.url);
      if (!response.ok)
        throw new Error(`Failed to fetch file: ${fileObj.filename}`);

      // Convert the response into a Blob and trigger download
      const blob = await response.blob();
      handleDownloadBlob(blob, fileObj.filename);
    }
  } catch (error) {
    console.error(`Failed to download file ${filenames[0]}: `, error);
  } finally {
    setBackendResponseLog("isDownloading", false);
  }
};

export default handleDownloadGCSFiles;
