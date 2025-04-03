/**
 * Represents the height and width of an image or mask.
 *
 * Used throughout the application for validation, resizing,
 * and ensuring consistent dimensions in image processing.
 */
export default interface ImgDimension {
  /** Image height in pixels */
  height: number;
  /** Image width in pixels */
  width: number;
}
