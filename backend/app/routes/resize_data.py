import os

from flask import Blueprint, jsonify

from app.services import ImageCropperResizerAndSaver
from app.utils import directory_store, list_filenames
from app.services import get_resized_dimension

resize_data = Blueprint(name='resize_data', import_name=__name__)


@resize_data.route('/resize-uploaded-images', methods=['POST'])
def resize_original_images():
    """Resizes uploaded images."""
    try:
        sample_img_name = list_filenames(directory_store.train_image_dir)[0]
        sample_img_path = str(os.path.join(directory_store.train_image_dir, sample_img_name))

        resize_width, resize_height = get_resized_dimension(sample_img_path)

        # Resize images
        image_resizer = ImageCropperResizerAndSaver(images_directory=directory_store.image_dir,
                                                    new_images_directory=directory_store.resized_image_dir,
                                                    image_channels=3,
                                                    final_image_shape=(resize_width, resize_height))
        image_resizer.process_data()

        return jsonify({'success': True, 'message': 'Uploaded images resized successfully!'}), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500



@resize_data.route('/resize-uploaded-masks', methods=['POST'])
def resize_original_masks():
    """Resizes uploaded images."""
    try:
        sample_img_name = list_filenames(directory_store.train_image_dir)[0]
        sample_img_path = str(os.path.join(directory_store.train_image_dir, sample_img_name))

        resize_width, resize_height = get_resized_dimension(sample_img_path)


        # Resize images
        mask_resizer = ImageCropperResizerAndSaver(images_directory=directory_store.mask_dir,
                                                    new_images_directory=directory_store.resized_mask_dir,
                                                    image_channels=3,
                                                    final_image_shape=(resize_width, resize_height))
        mask_resizer.process_data()

        return jsonify({'success': True, 'message': 'Uploaded masks resized successfully!'}), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
