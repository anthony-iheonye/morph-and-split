/**
 * Represents a signed URL entry used for uploading files to cloud storage.
 *
 * Contains metadata needed for the upload request including the destination filename,
 * the signed URL itself, and the content type for the file.
 */
export default interface SignedUrls {
  /** Name of the file to be uploaded */
  filename: string;
  /** Signed URL used to upload the file to cloud storage */
  url: string;
  /** MIME type of the file (e.g., 'image/png'), or null if not specified */
  content_type: string | null;
}
