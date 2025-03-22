from flask import Blueprint, jsonify

from app.config import get_google_cloud_config, get_google_cloud_directories, get_cors
from app.utils import create_project_directories, create_resized_augmentation_directories
from app.services.gcs_client import delete_google_cloud_storage_bucket
from app.services import create_google_cloud_storage_bucket

# Blueprint definition
reset_session = Blueprint('reset_session', __name__)

@reset_session.route('/reset_session', methods=['POST'])
def reset_project_session():
    try:
        # Delete all data by creating empty project folders
        create_project_directories(return_dir=False, overwrite_if_existing=True)
        create_resized_augmentation_directories(return_dir=False, overwrite_if_existing=True)
        google_cloud_config = get_google_cloud_config()
        cors = get_cors()
        directories = get_google_cloud_directories()


        delete_google_cloud_storage_bucket(google_cloud_config=google_cloud_config)

        # Create Google Cloud Storage
        create_google_cloud_storage_bucket(bucket_name=google_cloud_config.bucket_name,
                                           project=google_cloud_config.project_name,
                                           location=google_cloud_config.location,
                                           storage_class=google_cloud_config.storage_class,
                                           cors=cors,
                                           directories=directories)

        return jsonify({'success': True, }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500