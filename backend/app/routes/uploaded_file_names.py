from flask import Blueprint, jsonify

from app.config import google_cloud_config
from app.utils import list_files_in_bucket_directory

uploaded_file_names = Blueprint('uploaded_file_names', __name__)


@uploaded_file_names.route('/upload/image_names', methods=['GET'])
def get_uploaded_image_names():
    try:
        image_files = list_files_in_bucket_directory(bucket_name=google_cloud_config.bucket_name,
                                                     directory_path=f"{google_cloud_config.image_dir}/")

        return jsonify({'success': True, 'count': len(image_files), 'results': image_files }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@uploaded_file_names.route('/upload/mask_names', methods=['GET'])
def get_uploaded_mask_names():
    try:
        mask_files = list_files_in_bucket_directory(bucket_name=google_cloud_config.bucket_name,
                                                    directory_path=f"{google_cloud_config.mask_dir}/")

        return jsonify({'success': True, 'count': len(mask_files), 'results': mask_files}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


