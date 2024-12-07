import gc
import os

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

from app.services import resize_image
from app.utils import directory_store

image_upload = Blueprint('image_upload', __name__)
IMAGE_DIR = directory_store.image_dir
RESIZED_IMAGE_DIR = directory_store.resized_image_dir

@image_upload.route('/upload/images', methods=['POST'])
def upload_images():
    try:
        images = request.files.getlist('images')

        if not images:
            return jsonify({'message': 'No images uploaded'}), 400

        for img in images:
            print(img.filename)
            filename = secure_filename(img.filename)
            filepath = os.path.join(IMAGE_DIR, filename)
            img.save(filepath)

            resized_file_path = os.path.join(RESIZED_IMAGE_DIR, filename)

            resize_image(original_image_path=filepath,
                         resized_image_path=resized_file_path,
                         )
        return jsonify({'success': True}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

    finally:
        del images
        gc.collect()

