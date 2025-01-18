from flask import Blueprint, jsonify

from app.config import google_cloud_config
from app.utils import (delete_google_cloud_storage_bucket, \
                       delete_directory, directory_store)

delete_session = Blueprint('delete_session', __name__)

@delete_session.route('/delete_session', methods=['POST'])
def delete_project_session():
    try:
        # delete backend folders
        delete_directory(dir_name=directory_store.asset_dir)

        # Delete Google cloud storage bucket.
        delete_google_cloud_storage_bucket(bucket_name=google_cloud_config.bucket_name)
        return jsonify({'success': True, 'message': 'Successfully deleted the current project session.'}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
