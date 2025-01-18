from flask import Blueprint, jsonify

from app.utils import directory_store
from app.utils import get_sorted_filenames
import os

augmentation_status = Blueprint('augmentation_status', __name__)

@augmentation_status.route('/augmentation_complete_status', methods=['GET'])
def augmentation_complete():
    """
    Checks if the images were successfully uploaded.
    """
    try:
        zip_file_path = os.path.join(directory_store.augmented, 'augmented_data.zip')
        file_exist = os.path.exists(zip_file_path)

        if file_exist:
            return jsonify({'success': True, 'message': 'Augmentation complete'}), 200
        else:
            return jsonify({'success': False, 'message': 'Augmentation not complete'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500



