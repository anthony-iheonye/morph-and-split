from flask import Blueprint, jsonify

from app.config import google_cloud_config
from app.utils import get_sorted_filenames, directory_store
from app.services.gcs_client import list_files_in_bucket_directory

uploaded_file_names = Blueprint('uploaded_file_names', __name__)


@uploaded_file_names.route('/upload/gcs/image_names', methods=['GET'])
def get_uploaded_image_names_from_gcs():
    try:
        image_files = list_files_in_bucket_directory(bucket_name=google_cloud_config.bucket_name,
                                                     directory_path=f"{google_cloud_config.image_dir}/")

        return jsonify({'success': True, 'count': len(image_files), 'results': image_files }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@uploaded_file_names.route('/upload/gcs/mask_names', methods=['GET'])
def get_uploaded_mask_names_from_gcs():
    try:
        mask_files = list_files_in_bucket_directory(bucket_name=google_cloud_config.bucket_name,
                                                    directory_path=f"{google_cloud_config.mask_dir}/")

        return jsonify({'success': True, 'count': len(mask_files), 'results': mask_files}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@uploaded_file_names.route('/upload/backend/image_names', methods=['GET'])
def get_uploaded_image_names_from_backend():
    try:
        image_files = get_sorted_filenames(directory_path=directory_store.image_dir)

        return jsonify({'success': True, 'count': len(image_files), 'results': image_files }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@uploaded_file_names.route('/upload/backend/mask_names', methods=['GET'])
def get_uploaded_mask_names_from_backend():
    try:
        mask_files = get_sorted_filenames(directory_path=directory_store.mask_dir)

        return jsonify({'success': True, 'count': len(mask_files), 'results': mask_files}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


