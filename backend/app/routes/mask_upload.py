import gc
import os

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

from app.services import resize_image
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
            print(mask.filename)
            filename = secure_filename(mask.filename)
            filepath = os.path.join(MASK_DIR, filename)
            mask.save(filepath)

            resized_file_path = os.path.join(RESIZED_MASK_DIR, filename)

            resize_image(original_image_path=filepath,
                         resized_image_path=resized_file_path,
                         )
        return jsonify({'success': True}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

    finally:
        del masks
        gc.collect()
