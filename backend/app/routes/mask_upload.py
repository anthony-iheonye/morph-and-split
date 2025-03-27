import gc
import os

from flask import Blueprint, request, jsonify
from tensorflow.keras.backend import clear_session
from werkzeug.utils import secure_filename

from app.services import ImageCropperResizerAndSaver, session_store

mask_upload = Blueprint('mask_upload', __name__)


@mask_upload.route('/upload/masks', methods=['POST'])
def upload_masks():
    try:
        session_id = request.args.get('sessionId')
        masks = request.files.getlist('masks')
        directory_store = session_store.get_directory_store(session_id)

        if not masks:
            return jsonify({'message': 'No mask uploaded'}), 400

        for mask in masks:
            filename = secure_filename(mask.filename)
            filepath = os.path.join(directory_store.mask_dir, filename)
            mask.save(filepath)

        # resize images
        resizer = ImageCropperResizerAndSaver(images_directory=directory_store.mask_dir,
                                              new_images_directory=directory_store.resized_mask_dir,
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
