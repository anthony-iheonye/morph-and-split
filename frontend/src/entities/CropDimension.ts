/**
 * Represents the cropping dimensions for an image.
 *
 * Includes the offset (starting position) and target size (dimensions)
 * for both height and width.
 */
export default interface CropDimension {
  /** Vertical offset from the top of the image (in pixels) */
  offsetHeight: number;
  /** Horizontal offset from the left of the image (in pixels) */
  offsetWidth: number;
  /** Height of the cropped output (in pixels) */
  targetHeight: number;
  /** Width of the cropped output (in pixels) */
  targetWidth: number;
}
