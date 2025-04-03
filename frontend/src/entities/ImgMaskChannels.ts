/**
 * Represents the number of channels for an image and its corresponding mask.
 *
 * Used to define how many color channels are present in both images and masks,
 * such as 1 for grayscale or 3 for RGB.
 */
export default interface ImgMaskChannels {
  /** Number of color channels in the input image (e.g., 1 for grayscale, 3 for RGB) */
  imgChannels: number;
  /** Number of color channels in the mask (e.g., 1 for binary mask, 3 for color mask) */
  maskChannels: number;
}
