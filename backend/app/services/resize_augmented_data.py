from app.services.data_preprocessing import ImageAndMaskCropperResizerAndSaver
from app.utils import directory_store as ds
from app.aug_config import aug_config

channels = aug_config['imageMaskChannels']
image_channels = channels['imgChannels']
mask_channels = channels['maskChannels']

def resize_augmented_data():
    train_resizer = ImageAndMaskCropperResizerAndSaver(
        images_directory=ds.train_image_dir,
        masks_directory=ds.train_mask_dir,
        new_images_directory=ds.resized_train_image_dir,
        new_masks_directory=ds.resized_train_mask_dir,
        image_mask_channels=(image_channels, mask_channels),
        final_image_shape=(256, 256)
    )

    val_resizer = ImageAndMaskCropperResizerAndSaver(
        images_directory=ds.val_image_dir,
        masks_directory=ds.val_mask_dir,
        new_images_directory=ds.resized_val_image_dir,
        new_masks_directory=ds.resized_val_mask_dir,
        image_mask_channels=(image_channels, mask_channels),
        final_image_shape=(256, 256)
    )

    test_resizer = ImageAndMaskCropperResizerAndSaver(
        images_directory=ds.test_image_dir,
        masks_directory=ds.test_mask_dir,
        new_images_directory=ds.resized_test_image_dir,
        new_masks_directory=ds.resized_test_mask_dir,
        image_mask_channels=(image_channels, mask_channels),
        final_image_shape=(256, 256)
    )

    train_resizer.process_data()
    val_resizer.process_data()
    test_resizer.process_data()

if __name__ == '__main__':
    resize_augmented_data()
