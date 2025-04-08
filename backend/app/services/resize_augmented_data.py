from app.services.data_preprocessing import ImageAndMaskCropperResizerAndSaver
from app.utils import list_filenames, get_file_extension
from .session_store import session_store
from PIL import Image
import os


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

        return  new_height, new_width, num_channels, height, width


def resize_augmented_data(session_id: str):
    """
    Resizes the training, validation, and test datasets for images and masks associated with a session.

    This function determines the target dimensions by inspecting one sample image and mask.
    It then initializes separate resizer objects for training, validation, and test sets,
    which perform resizing and saving to designated directories.

    :param session_id: The session identifier used to retrieve image and mask directories.
    :return: None
    """
    directory_store = session_store.get_directory_store(session_id)

    sample_img_name = list_filenames(directory_store.train_image_dir)[0]
    sample_img_path = str(os.path.join(directory_store.train_image_dir, sample_img_name))

    sample_mask_name = list_filenames(directory_store.train_mask_dir)[0]
    sample_mask_path = str(os.path.join(directory_store.train_mask_dir, sample_mask_name))

    resize_height, resize_width, image_channels, _ , _ = get_resized_dimension(sample_img_path)
    _, _, mask_channels, _, _ = get_resized_dimension(sample_mask_path)

    image_extension = get_file_extension(sample_img_name)
    mask_extension = get_file_extension(sample_mask_name)

    train_resizer = ImageAndMaskCropperResizerAndSaver(
        images_directory=directory_store.train_image_dir,
        masks_directory=directory_store.train_mask_dir,
        new_images_directory=directory_store.resized_train_image_dir,
        new_masks_directory=directory_store.resized_train_mask_dir,
        image_mask_channels=(image_channels, mask_channels),
        final_image_shape=(resize_height, resize_width),
        image_save_format=image_extension,
        mask_save_format=mask_extension,
    )

    val_resizer = ImageAndMaskCropperResizerAndSaver(
        images_directory=directory_store.val_image_dir,
        masks_directory=directory_store.val_mask_dir,
        new_images_directory=directory_store.resized_val_image_dir,
        new_masks_directory=directory_store.resized_val_mask_dir,
        image_mask_channels=(image_channels, mask_channels),
        final_image_shape=(resize_height, resize_width),
        image_save_format=image_extension,
        mask_save_format=mask_extension,
    )

    test_resizer = ImageAndMaskCropperResizerAndSaver(
        images_directory=directory_store.test_image_dir,
        masks_directory=directory_store.test_mask_dir,
        new_images_directory=directory_store.resized_test_image_dir,
        new_masks_directory=directory_store.resized_test_mask_dir,
        image_mask_channels=(image_channels, mask_channels),
        final_image_shape=(resize_height, resize_width),
        image_save_format=image_extension,
        mask_save_format=mask_extension,
    )

    train_resizer.process_data()
    val_resizer.process_data()
    test_resizer.process_data()


