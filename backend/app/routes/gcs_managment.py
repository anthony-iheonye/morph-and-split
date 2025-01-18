from flask import Blueprint, jsonify

from app.config import google_cloud_config, DIRECTORIES, cors
from app.utils import create_google_cloud_storage_bucket, \
    delete_google_cloud_storage_bucket

# Blueprint definition
gcs_management = Blueprint('gcs_management', __name__)

@gcs_management.route('/gcs/create_bucket', methods=['POST'])
def create_bucket():
    try:

        # Create Google Cloud Storage
        create_google_cloud_storage_bucket(bucket_name=google_cloud_config.bucket_name,
                                           project=google_cloud_config.project_name,
                                           location=google_cloud_config.location,
                                           storage_class=google_cloud_config.storage_class,
                                           cors=cors,
                                           directories=DIRECTORIES)

        return jsonify({'success': True,
                        'message': f"Google cloud Storage bucket "
                                   f"{google_cloud_config.bucket_name} created successfully."}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500



@gcs_management.route('/gcs/delete_bucket', methods=['DELETE'])
def delete_bucket():
    try:
        # Delete Google cloud storage bucket.
        delete_google_cloud_storage_bucket(bucket_name=google_cloud_config.bucket_name)
        return jsonify({'success': True,
                        'message': f"Google Cloud Storage bucket "
                                   f"{google_cloud_config.bucket_name} deleted successfully. "}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
