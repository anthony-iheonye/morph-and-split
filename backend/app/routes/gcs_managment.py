import time

from flask import Blueprint, jsonify
import logging

from google.cloud import storage

from app.config import google_cloud_config, DIRECTORIES
from app.services import create_google_cloud_storage_bucket, reset_global_bucket_variables, get_bucket
from app.services.gcs_client import delete_and_recreate_directories_in_gcs_bucket, delete_google_cloud_storage_bucket, \
    create_folders_in_bucket

logger = logging.getLogger(__name__)


# Blueprint definition
gcs_management = Blueprint('gcs_management', __name__)

@gcs_management.route('/gcs/create_bucket', methods=['POST'])
def create_bucket():
    try:

        # Create Google Cloud Storage
        bucket = create_google_cloud_storage_bucket(directories=DIRECTORIES,
                                                    google_cloud_config=google_cloud_config)

        if bucket is None:
            return jsonify({'success': False,
                            'message': f"Failed to create storage bucket '{google_cloud_config.bucket_name}'."})

        # # Wait until the bucket is fully available
        # storage_client = storage.Client()
        # retries = 5 # Max retries to check bucket availability
        # for _ in range(retries):
        #     if storage_client.lookup_bucket(google_cloud_config.bucket_name):
        #         break
        #     time.sleep(3)

        return jsonify({'success': True,
                        'message': f"Google cloud Storage bucket "
                                   f"{google_cloud_config.bucket_name} created successfully."}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@gcs_management.route('/gcs/create_folders_in_bucket', methods=['POST'])
def create_directories_in_bucket():
    try:
        # storage_client = storage.Client()
        # bucket = storage_client.lookup_bucket(google_cloud_config.bucket_name)
        #
        # if not bucket:
        #     return jsonify({'success': False,
        #                     'message': f"Bucket '{google_cloud_config.bucket_name}' not found."}), 400

        success = create_folders_in_bucket(directories=DIRECTORIES,
                                           google_cloud_config=google_cloud_config)

        if success:
            return jsonify({'success': True,
                            'message': f"Directories created in bucket '{google_cloud_config.bucket_name}'"}), 201
        else:
            return jsonify({'success': False,
                            'message': f"Failed to create directories in bucket '{google_cloud_config.bucket_name}'"}), 400

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@gcs_management.route('/gcs/delete_bucket', methods=['DELETE'])
def delete_bucket():
    try:
        # Delete Google cloud storage bucket.
        delete_google_cloud_storage_bucket(google_cloud_config=google_cloud_config)
        return jsonify({'success': True,
                        'message': f"Google Cloud Storage bucket "
                                   f"{google_cloud_config.bucket_name} deleted successfully. "}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@gcs_management.route('/gcs/resized_original_images/delete', methods=['DELETE'])
def delete_uploaded_images():
    """
    Delete the uploaded images from the 'images' folder
    :return:
    """

    try:
        delete_and_recreate_directories_in_gcs_bucket(directories=[google_cloud_config.resized_image_dir,],
                                                      google_cloud_config=google_cloud_config,)

        return jsonify({'success': True,
                        'message': 'Successfully deleted uploaded images in Google Cloud Storage Bucket'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@gcs_management.route('/gcs/resized_original_masks/delete', methods=['DELETE'])
def delete_uploaded_masks():
    """
    Delete the uploaded masks from the 'masks' folder
    :return:
    """

    try:
        delete_and_recreate_directories_in_gcs_bucket(directories=[google_cloud_config.resized_mask_dir, ],
                                                      google_cloud_config=google_cloud_config,)

        return jsonify({'success': True,
                        'message': 'Successfully deleted uploaded masks in Google Cloud Storage Bucket'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@gcs_management.route('/gcs/reset_global_buckets_variables', methods=['POST'])
def reset_global_buckets():
    """
    An endpoint to reset the global bucket variables
    :return: JSON response
    """

    try:
        success = reset_global_bucket_variables()

        if success:
            return jsonify({'success': True,
                            'message': 'Successfully reset global bucket parameter to None'}), 200
        else:
            return jsonify({'success': False, 'error': "Failed to reset global bucket variables."}), 500

    except Exception as e:
        logger.exception("Unexpected error in reset_global_buckets endpoint.")
        return jsonify({'success': False,
                        'error': f"An unexpected error occurred while resetting buckets: {e}"}), 500

