import { BackendResponseLog } from "../store";
import APIClient from "./api-client";
import handleDownloadBlob from "./handleDownloadBlob";

/**
 *
 * @param filenames
 * @param setBackendResponseLog
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

    // Get signed download URLs
    const signedUrls = await gcsDownloadAPI.getSignedDownloadUrls(filenames);
    if (!signedUrls.length) throw new Error("No signed URLs found.");

    for (const fileObj of signedUrls) {
      console.log(`Downloading from : ${fileObj.filename}`);

      //fetch file from the signed URL
      const response = await fetch(fileObj.url);
      if (!response.ok)
        throw new Error(`Failed to fetch file: ${fileObj.filename}`);

      // Convert response to Blob
      const blob = await response.blob();

      // Trigger file download
      handleDownloadBlob(blob, fileObj.filename);
    }
  } catch (error) {
    console.error(`Failed to downoad file ${filenames[0]}: `, error);
  } finally {
    setBackendResponseLog("isDownloading", false);
  }
};

export default handleDownloadGCSFiles;
