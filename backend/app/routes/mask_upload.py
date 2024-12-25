import gc
import os

from flask import Blueprint, request, jsonify
from tensorflow.keras.backend import clear_session
from werkzeug.utils import secure_filename

from app.services import ImageCropperResizerAndSaver
from app.utils import directory_store

mask_upload = Blueprint('mask_upload', __name__)
MASK_DIR = directory_store.mask_dir
RESIZED_MASK_DIR = directory_store.resized_mask_dir


@mask_upload.route('/upload/masks', methods=['POST'])
def upload_masks():
    try:
        masks = request.files.getlist('masks')

        if not masks:
            return jsonify({'message': 'No mask uploaded'}), 400

        for mask in masks:
            filename = secure_filename(mask.filename)
            filepath = os.path.join(MASK_DIR, filename)
            mask.save(filepath)

        # resize images
        resizer = ImageCropperResizerAndSaver(images_directory=MASK_DIR,
                                              new_images_directory=RESIZED_MASK_DIR,
                                              image_channels=3,
                                              final_image_shape=(256, 256))
        resizer.process_data()
        return jsonify({'success': True}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

    finally:
        del masks
        clear_session()
        gc.collect()
