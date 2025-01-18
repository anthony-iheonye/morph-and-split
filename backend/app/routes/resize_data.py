from flask import Blueprint, jsonify

from app.services import ImageCropperResizerAndSaver
from app.utils import directory_store

resize_data = Blueprint(name='resize_data', import_name=__name__)


@resize_data.route('/resize-uploaded-images', methods=['POST'])
def resize_original_images():
    """Resizes uploaded images."""
    try:
        # Resize images
        image_resizer = ImageCropperResizerAndSaver(images_directory=directory_store.image_dir,
                                                    new_images_directory=directory_store.resized_image_dir,
                                                    image_channels=3,
                                                    final_image_shape=(256, 256))
        image_resizer.process_data()

        return jsonify({'success': True, 'message': 'Uploaded images resized successfully!'}), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500



@resize_data.route('/resize-uploaded-masks', methods=['POST'])
def resize_original_masks():
    """Resizes uploaded images."""
    try:
        # Resize images
        mask_resizer = ImageCropperResizerAndSaver(images_directory=directory_store.mask_dir,
                                                    new_images_directory=directory_store.resized_mask_dir,
                                                    image_channels=3,
                                                    final_image_shape=(256, 256))
        mask_resizer.process_data()

        return jsonify({'success': True, 'message': 'Uploaded masks resized successfully!'}), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
