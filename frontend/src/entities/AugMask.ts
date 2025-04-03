/**
 * Represents an augmented mask object associated with an image.
 *
 * This interface includes metadata and the mask file reference,
 * and is used in processes like previewing, uploading, and augmentation.
 */
export default interface AugMask {
  /** Unique identifier for the mask */
  id: number | string;
  /** Name of the mask file without extension */
  name: string;
  /** File extension for the mask (limited to common formats) */
  extension: "jpg" | "png" | "jpeg";
  /** Public URL pointing to the mask asset */
  url: string;
  /** Original File object used for upload or processing */
  file: File;
}
