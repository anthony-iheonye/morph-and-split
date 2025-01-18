from flask import Blueprint, jsonify

from app.utils import directory_store
from app.utils import get_sorted_filenames

file_upload_status = Blueprint('file_upload_status', __name__)

@file_upload_status.route('/image_upload_status', methods=['GET'])
def images_upload_status():
    """
    Checks if the images were successfully uploaded.
    """
    try:
        count = len(get_sorted_filenames(directory_store.image_dir))
        if count > 0:
            return jsonify({'success': True, 'count': count, 'message': 'images uploaded successfully'}), 200
        else:
            return jsonify({'success': False, 'count': count, 'message': 'No images uploaded'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@file_upload_status.route('/mask_upload_status', methods=['GET'])
def masks_upload_status():
    """
    Checks if the masks were successfully uploaded, and that the number of masks equal the number of images..
    """
    try:
        images_count = len(get_sorted_filenames(directory_store.image_dir))
        masks_count = len(get_sorted_filenames(directory_store.mask_dir))

        if all([images_count > 0, masks_count > 0, masks_count == images_count]):
            return jsonify({'success': True, 'message': 'Mask uploaded successfully, and masks count match image count.'}), 200
        else:
            return jsonify({'success': False, 'message': f'Image count ({images_count}) and masks count ({masks_count}) do not match.'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

