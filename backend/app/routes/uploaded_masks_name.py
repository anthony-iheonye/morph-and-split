from flask import Blueprint, jsonify

from app.config import google_cloud_config
from app.utils import list_files_in_bucket_directory

uploaded_mask_names = Blueprint('uploaded_mask_names', __name__)

@uploaded_mask_names.route('/upload/mask_names', methods=['GET'])
def get_uploaded_image_names():
    try:
        mask_files = list_files_in_bucket_directory(bucket_name=google_cloud_config.bucket_name,
                                                    directory_path=f"{google_cloud_config.mask_dir}/")

        return jsonify({'count': len(mask_files), 'results': mask_files})
    except Exception as e:
        return jsonify({'error': str(e)})
