from app.services.data_preprocessing import ImageAndMaskCropperResizerAndSaver
from app.utils import directory_store as ds, list_filenames
from app.aug_config import aug_config
from PIL import Image
import os

# channels = aug_config['imageMaskChannels']
# image_channels = channels['imgChannels']
# mask_channels = channels['maskChannels']


def get_resized_dimension(image_path: str):
    """
        Determines the optimal dimensions to resize an image while maintaining its aspect ratio.

        Conditions:
        1. No dimension should be reduced below 256px.
        2. If both dimensions are greater than 256px, resize the smaller side to 256px
           and scale the other proportionally to maintain aspect ratio.
        3. If either dimension is already 256px or less, return the original dimensions.

        :param image_path: Path to the image file.
        :return: (new_width, new_height) tuple with the resized dimensions.
    """

    with Image.open(image_path) as img:
        width, height = img.size
        num_channels = len(img.getbands())

        if width <= 256 or height <= 256:
            return width, height

        if width < height:
            new_width = 256
            new_height = (256 * height) // width
        else:
            new_height = 256
            new_width = (256 * width) // height

        return  new_height, new_width, num_channels


def resize_augmented_data():
    sample_img_name = list_filenames(ds.image_dir)[0]
    sample_img_path = str(os.path.join(ds.image_dir, sample_img_name))

    sample_mask_name = list_filenames(ds.mask_dir)[0]
    sample_mask_path = str(os.path.join(ds.mask_dir, sample_mask_name))

    resize_width, resize_height, image_channels = get_resized_dimension(sample_img_path)
    _, _, mask_channels = get_resized_dimension(sample_mask_path)

    train_resizer = ImageAndMaskCropperResizerAndSaver(
        images_directory=ds.train_image_dir,
        masks_directory=ds.train_mask_dir,
        new_images_directory=ds.resized_train_image_dir,
        new_masks_directory=ds.resized_train_mask_dir,
        image_mask_channels=(image_channels, mask_channels),
        final_image_shape=(resize_width, resize_height)
    )

    val_resizer = ImageAndMaskCropperResizerAndSaver(
        images_directory=ds.val_image_dir,
        masks_directory=ds.val_mask_dir,
        new_images_directory=ds.resized_val_image_dir,
        new_masks_directory=ds.resized_val_mask_dir,
        image_mask_channels=(image_channels, mask_channels),
        final_image_shape=(resize_width, resize_height)
    )

    test_resizer = ImageAndMaskCropperResizerAndSaver(
        images_directory=ds.test_image_dir,
        masks_directory=ds.test_mask_dir,
        new_images_directory=ds.resized_test_image_dir,
        new_masks_directory=ds.resized_test_mask_dir,
        image_mask_channels=(image_channels, mask_channels),
        final_image_shape=(resize_width, resize_height)
    )

    train_resizer.process_data()
    val_resizer.process_data()
    test_resizer.process_data()


