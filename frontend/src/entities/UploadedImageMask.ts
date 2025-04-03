/**
 * Metadata represents basic file information used for referencing uploaded images or masks.
 */
export interface Metadata {
  /** Name of the file (typically without path) */
  name: string;
  /** URL pointing to the uploaded file location */
  url: string;
}

/**
 * UploadedImageMask pairs a single image with its corresponding mask.
 *
 * Both `image` and `mask` follow the `Metadata` structure for consistent handling
 * in previewing, downloading, or identifying uploaded pairs.
 */
export default interface UploadedImageMask {
  /** Metadata for the uploaded image */
  image: Metadata;
  /** Metadata for the corresponding uploaded mask */
  mask: Metadata;
}
