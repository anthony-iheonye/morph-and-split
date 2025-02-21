/**
 * Function to download file as a Blob
 * @param data Blob to be downloaded.
 * @param filename Name of the file.
 */
const handleDownloadBlob = (data: Blob, filename: string) => {
  const blob = new Blob([data]);
  // create temporary url pointing to the blob
  const url = window.URL.createObjectURL(blob);
  // Create a link element
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default handleDownloadBlob;
