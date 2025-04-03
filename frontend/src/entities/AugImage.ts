/**
 * Represents an augmented image object used throughout the application.
 *
 * This interface includes the image metadata and file reference,
 * used for previewing, uploading, and tracking image assets.
 */
export default interface AugImage {
  /** Unique identifier for the image */
  id: number | string;
  /** Name of the image file without extension */
  name: string;
  /** File extension for the image (limited to common formats) */
  extension: "jpg" | "png" | "jpeg";
  /** Public URL pointing to the image asset */
  url: string;
  /** Original File object used for upload or processing */
  file: File;
}
