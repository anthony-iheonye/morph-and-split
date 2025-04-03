/**
 * Defines folder paths used in the Google Cloud Storage bucket for storing
 * original, resized, and augmented image/mask data.
 */
const bucketFolders = {
  /** Folder for original uploaded images */
  images: "images",

  /** Folder for original uploaded masks */
  masks: "masks",

  /** Folder for resized (but not split) images */
  resized_images: "resized_images",

  /** Folder for resized (but not split) masks */
  resized_masks: "resized_masks",

  /** Folder for resized and augmented training images */
  resized_train_images: "resized_augmented/train/images",

  /** Folder for resized and augmented training masks */
  resized_train_masks: "resized_augmented/train/masks",

  /** Folder for resized and augmented validation images */
  resized_val_images: "resized_augmented/val/images",

  /** Folder for resized and augmented validation masks */
  resized_val_masks: "resized_augmented/val/masks",

  /** Folder for resized and augmented test images */
  resized_test_images: "resized_augmented/test/images",

  /** Folder for resized and augmented test masks */
  resized_test_masks: "resized_augmented/test/masks",
};

export default bucketFolders;
