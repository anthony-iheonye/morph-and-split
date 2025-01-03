from flask import Blueprint, jsonify

from app.config import google_cloud_config, DIRECTORIES, cors
from app.utils import create_project_directories, delete_google_cloud_storage_bucket, \
    create_google_cloud_storage_bucket, create_resized_augmentation_directories

# Blueprint definition
reset_session = Blueprint('reset_session', __name__)

@reset_session.route('/reset_session', methods=['POST'])
def reset_project_session():
    try:
        # Delete all data by creating empty project folders
        create_project_directories(return_dir=False, overwrite_if_existing=True)
        create_resized_augmentation_directories(return_dir=False, overwrite_if_existing=True)

        delete_google_cloud_storage_bucket(bucket_name=google_cloud_config.bucket_name)

        # Create Google Cloud Storage
        create_google_cloud_storage_bucket(bucket_name=google_cloud_config.bucket_name,
                                           project=google_cloud_config.project_name,
                                           location=google_cloud_config.location,
                                           storage_class=google_cloud_config.storage_class,
                                           cors=cors,
                                           directories=DIRECTORIES)

        return jsonify({'success': True, }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500