from flask import Blueprint, jsonify, request

from app.services import session_store
from app.services.gcs_client import list_files_in_bucket_directory
from app.utils import get_sorted_filenames, list_filenames

uploaded_file_names = Blueprint('uploaded_file_names', __name__)


@uploaded_file_names.route('/upload/gcs/image_names', methods=['GET'])
def get_uploaded_image_names_from_gcs():
    try:
        session_id = request.args.get('sessionId')
        google_cloud_config = session_store.gcs_config
        image_files = list_files_in_bucket_directory(session_id=session_id,
                                                     directory_path=f"{google_cloud_config.image_dir}/")

        return jsonify({'success': True, 'count': len(image_files), 'results': image_files }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@uploaded_file_names.route('/upload/gcs/mask_names', methods=['GET'])
def get_uploaded_mask_names_from_gcs():
    try:
        session_id = request.args.get('sessionId')
        google_cloud_config = session_store.gcs_config
        mask_files = list_files_in_bucket_directory(session_id=session_id,
                                                    directory_path=f"{google_cloud_config.mask_dir}/")

        return jsonify({'success': True, 'count': len(mask_files), 'results': mask_files}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@uploaded_file_names.route('/upload/backend/image_names', methods=['GET'])
def get_uploaded_image_names_from_backend():
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id)

        image_files = get_sorted_filenames(directory_path=directory_store.image_dir)

        return jsonify({'success': True, 'count': len(image_files), 'results': image_files }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@uploaded_file_names.route('/upload/backend/mask_names', methods=['GET'])
def get_uploaded_mask_names_from_backend():
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id)

        mask_files = get_sorted_filenames(directory_path=directory_store.mask_dir)

        return jsonify({'success': True, 'count': len(mask_files), 'results': mask_files}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@uploaded_file_names.route('/upload/backend/stratification_data_filename', methods=['GET'])
def get_name_of_stratification_data_file():
    """Fetch the name of the stratification data file."""
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id)

        file_names = list_filenames(directory_path=directory_store.stratification_data_file_dir)

        if file_names:
            return jsonify({'success': True, 'results': file_names}), 200
        else:
            return jsonify({'success': False, 'results': file_names}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


