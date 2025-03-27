import os

from flask import Blueprint, jsonify, request

from app.services import session_store
from app.utils import directory_exit, list_filenames

status_checks = Blueprint('status_checks', __name__)

@status_checks.route('/status_checks/image_upload_status', methods=['GET'])
def images_upload_status():
    """
    Checks if the images were successfully uploaded.
    """
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id)

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
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id)

        masks_count = len(list_filenames(directory_store.mask_dir))

        if masks_count > 0:
            return jsonify({'success': True,
                            'message': 'Masks uploaded successfully.'}), 200
        else:
            return jsonify({'success': False,
                            'message': f'Masks have not been uploaded'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@status_checks.route('/status_checks/is_uploading_images', methods=['GET'])
def image_is_uploading_status():
    """
    Checks if image upload is in progress.
    """
    try:
        session_id = request.args.get('sessionId')
        is_uploading_images = session_store.image_is_uploading(session_id)

        if is_uploading_images:
            return jsonify({'success': True,
                            'message': 'Image upload in progress.'}), 200
        else:
            return jsonify({'success': False,
                            'message': f'Image upload not in progress'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@status_checks.route('/status_checks/is_uploading_masks', methods=['GET'])
def mask_is_uploading_status():
    """
    Checks if mask upload is in progress.
    """
    try:
        session_id = request.args.get('sessionId')
        is_uploading_masks = session_store.mask_is_uploading(session_id)

        if is_uploading_masks:
            return jsonify({'success': True,
                            'message': 'mask upload in progress.'}), 200
        else:
            return jsonify({'success': False,
                            'message': f'mask upload not in progress'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@status_checks.route('/status_checks/image_mask_balance_status', methods=['GET'])
def image_mask_balance_status():
    """
    Checks if the number of uploaded images equal the number of uploaded masks.
    """
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id)
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
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id)

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
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id)

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
        session_id = request.args.get('sessionId')
        augmentation_running = session_store.is_augmentation_running(session_id=session_id)

        if augmentation_running:
            return jsonify({'isRunning': True, 'message': 'Augmentation is running'}), 200
        else:
            return jsonify({'isRunning': False, 'message': 'Augmentation is not running'}), 200
    except Exception as e:
        return jsonify({'isRunning': False, 'error': str(e)}), 500


@status_checks.route('/status_checks/set_augmentation_as_running', methods=['POST'])
def set_augmentation_as_running():
    """
    Checks if augmentation is running.
    """
    try:
        session_id = request.args.get('sessionId')
        session_store.set_augmentation_running(session_id=session_id)

        if session_store.is_augmentation_running(session_id=session_id):
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
        session_id = request.args.get('sessionId')
        session_is_running = session_store.is_session_running(session_id=session_id)

        if session_is_running:
            return jsonify({'isRunning': True, 'message': 'Session is running'}), 200
        else:
            return jsonify({'isRunning': False, 'message': 'Session is not running'}), 200
    except Exception as e:
        return jsonify({'isRunning': False, 'error': str(e)}), 500

