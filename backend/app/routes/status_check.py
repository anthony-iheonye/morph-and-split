import os

from flask import Blueprint, jsonify
from .session_control import session_is_running

from app.routes.augment import is_augmenting
from app.utils import directory_exit, directory_store, get_sorted_filenames, list_filenames

status_checks = Blueprint('status_checks', __name__)

@status_checks.route('/status_checks/image_upload_status', methods=['GET'])
def images_upload_status():
    """
    Checks if the images were successfully uploaded.
    """
    try:
        count = len(list_filenames(directory_store.image_dir))
        if count > 0:
            return jsonify({'success': True, 'count': count,
                            'message': 'images uploaded successfully'}), 200
        else:
            return jsonify({'success': False, 'count': count,
                            'message': 'No images uploaded'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@status_checks.route('/status_checks/mask_upload_status', methods=['GET'])
def masks_upload_status():
    """
    Checks if masks were successfully uploaded to the mask folder.
    """
    try:
        masks_count = len(list_filenames(directory_store.mask_dir))

        if masks_count > 0:
            return jsonify({'success': True,
                            'message': 'Masks uploaded successfully.'}), 200
        else:
            return jsonify({'success': False,
                            'message': f'Masks have not been uploaded'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@status_checks.route('/status_checks/image_mask_balance_status', methods=['GET'])
def image_mask_balance_status():
    """
    Checks if the number of uploaded images equal the number of uploaded masks.
    """
    try:
        images_count = len(list_filenames(directory_store.image_dir))
        masks_count = len(list_filenames(directory_store.mask_dir))

        if images_count == masks_count:
            return jsonify({'success': True,
                            'message': 'Number of uploaded images is equal to number of uploaded masks.'}), 200
        else:
            return jsonify({'success': False,
                            'message': f'Number of images ({images_count}) do not match number of masks ({masks_count}). Please ensure they are equal.'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@status_checks.route('/status_checks/augmentation_is_complete', methods=['GET'])
def augmentation_complete():
    """
    Checks if augmentation was completed successfully.
    """
    try:
        zip_file_path = os.path.join(directory_store.augmented, 'augmented_data.zip')
        file_exist = os.path.exists(zip_file_path)

        if file_exist:
            return jsonify({'success': True, 'message': 'Augmentation completed successfully'}), 200
        else:
            return jsonify({'success': False, 'message': 'Augmentation not complete'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@status_checks.route('/status_checks/backend_is_running', methods=['GET'])
def backend_is_running():
    """
    Checks if a session is currently running.
    """
    try:
        if directory_exit(directory_store.image_dir):
            return jsonify({'success': True, 'message': 'Session is running'}), 200
        else:
            return jsonify({'success': False, 'message': 'Session is not running'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@status_checks.route('/status_checks/augmentation_is_running', methods=['GET'])
def augmentation_is_running():
    """
    Checks if augmentation is running.
    """
    try:
        if is_augmenting.is_set():
            return jsonify({'isRunning': True, 'message': 'Augmentation is running'}), 200
        else:
            return jsonify({'isRunning': False, 'message': 'Augmentation is not running'}), 200
    except Exception as e:
        return jsonify({'isRunning': False, 'error': str(e)}), 500


@status_checks.route('/status_checks/session_is_running', methods=['GET'])
def session_in_progress():
    """
    Checks if a session is currently running.
    :return:
    """
    try:
        if session_is_running.is_set():
            return jsonify({'isRunning': True, 'message': 'Session is running'}), 200
        else:
            return jsonify({'isRunning': False, 'message': 'Session is not running'}), 200
    except Exception as e:
        return jsonify({'isRunning': False, 'error': str(e)}), 500

