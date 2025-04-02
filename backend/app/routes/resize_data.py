import os
import gc

from flask import Blueprint, jsonify, request

from app.services import ImageCropperResizerAndSaver
from app.utils import list_filenames, get_file_extension
from app.services import get_resized_dimension, session_store
from tensorflow.keras.backend import clear_session


resize_data = Blueprint(name='resize_data', import_name=__name__)


@resize_data.route('/resize-uploaded-images', methods=['POST'])
def resize_original_images():
    """Resizes uploaded images."""
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id)

        sample_img_name = list_filenames(directory_store.image_dir)[0]
        sample_img_path = str(os.path.join(directory_store.image_dir, sample_img_name))

        resize_height, resize_width, channels, original_height, original_width = get_resized_dimension(sample_img_path)
        session_store.set_image_dimension(session_id, original_height, original_width)
        extension = get_file_extension(sample_img_name)

        # Resize images
        image_resizer = ImageCropperResizerAndSaver(images_directory=directory_store.image_dir,
                                                    new_images_directory=directory_store.resized_image_dir,
                                                    image_channels=channels,
                                                    final_image_shape=(resize_height, resize_width),
                                                    image_save_format=extension)
        image_resizer.process_data()

        return jsonify({'success': True, 'message': 'Uploaded images resized successfully!'}), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        # clear Tensorflow session and garbage collect unused variables
        clear_session()
        gc.collect()


@resize_data.route('/resize-uploaded-masks', methods=['POST'])
def resize_original_masks():
    """Resizes uploaded images."""
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id)

        sample_img_name = list_filenames(directory_store.mask_dir)[0]
        sample_img_path = str(os.path.join(directory_store.mask_dir, sample_img_name))

        resize_height, resize_width, channels, _ , _ = get_resized_dimension(sample_img_path)
        extension = get_file_extension(sample_img_name)


        # Resize masks
        mask_resizer = ImageCropperResizerAndSaver(images_directory=directory_store.mask_dir,
                                                    new_images_directory=directory_store.resized_mask_dir,
                                                    image_channels=channels,
                                                    final_image_shape=(resize_height, resize_width),
                                                   image_save_format=extension)
        mask_resizer.process_data()

        return jsonify({'success': True, 'message': 'Uploaded masks resized successfully!'}), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

    finally:
        # clear Tensorflow session and garbage collect unused variables
        clear_session()
        gc.collect()

