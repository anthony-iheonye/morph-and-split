import gc

from flask import Blueprint, jsonify
from tensorflow.keras.backend import clear_session

from app.config import google_cloud_config
from app.services import ImageCropperResizerAndSaver
from app.utils import download_files_from_gcs_folder, directory_store


resize_uploaded_images = Blueprint(name='resize_uploaded_images', import_name=__name__)

@resize_uploaded_images.route('/resize-uploaded-images', methods=['POST'])
def resize_original_images():
    """Resizes uploaded images."""
    try:
        # Resize images
        image_resizer = ImageCropperResizerAndSaver(images_directory=directory_store.image_dir,
                                                    new_images_directory=directory_store.resized_image_dir,
                                                    image_channels=3,
                                                    final_image_shape=(256, 256))
        image_resizer.process_data()

        return jsonify({'success': True, 'message': 'Uploaded images resized successfully!'}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
