from flask import Blueprint, jsonify

from app.services import ImageCropperResizerAndSaver
from app.utils import directory_store

resize_uploaded_masks = Blueprint(name='resize_uploaded_masks', import_name=__name__)

@resize_uploaded_masks.route('/resize-uploaded-masks', methods=['POST'])
def resize_original_images():
    """Resizes uploaded images."""
    try:
        # Resize images
        mask_resizer = ImageCropperResizerAndSaver(images_directory=directory_store.mask_dir,
                                                    new_images_directory=directory_store.resized_mask_dir,
                                                    image_channels=3,
                                                    final_image_shape=(256, 256))
        mask_resizer.process_data()

        return jsonify({'success': True, 'message': 'Uploaded masks resized successfully!'}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
