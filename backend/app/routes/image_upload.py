import gc
import os

from flask import Blueprint, request, jsonify
from tensorflow.keras.backend import clear_session
from werkzeug.utils import secure_filename

from app.services import ImageCropperResizerAndSaver, session_store

image_upload = Blueprint('image_upload', __name__)


@image_upload.route('/upload/images', methods=['POST'])
def upload_images():
    try:
        session_id = request.args.get('sessionId')
        images = request.files.getlist('images')
        directory_store = session_store.get_directory_store(session_id)

        if not images:
            return jsonify({'message': 'No images uploaded'}), 400

        for img in images:
            filename = secure_filename(img.filename)
            filepath = os.path.join(directory_store.image_dir, filename)
            img.save(filepath)

        # resize images
        resizer = ImageCropperResizerAndSaver(images_directory=directory_store.image_dir,
                                              new_images_directory=directory_store.resized_image_dir,
                                              image_channels=3,
                                              final_image_shape=(256, 256))
        resizer.process_data()

        return jsonify({'success': True}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

    finally:
        del images
        clear_session()
        gc.collect()

