/**
 * Downloads a file from a Blob object by creating a temporary URL and simulating a click.
 *
 * @param data - The Blob data to download.
 * @param filename - The desired name of the downloaded file.
 */
const handleDownloadBlob = (data: Blob, filename: string) => {
  const blob = new Blob([data]);

  // Create a temporary URL pointing to the blob
  const url = window.URL.createObjectURL(blob);

  // Create and click a link to start the download
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Clean up the temporary URL
  window.URL.revokeObjectURL(url);
};

export default handleDownloadBlob;
