import logging

from flask import Blueprint, jsonify, request

from app.services import (create_google_cloud_storage_bucket,
                          session_store)
from app.services.gcs_client import (delete_and_recreate_directories_in_gcs_bucket,
                                     delete_google_cloud_storage_bucket,
                                     create_folders_in_bucket)

logger = logging.getLogger(__name__)


# Blueprint definition
gcs_management = Blueprint('gcs_management', __name__)


@gcs_management.route('/gcs/create_bucket', methods=['POST'])
def create_bucket():
    """Create a new Google Cloud Storage Bucket scoped to a session."""
    try:
        session_id = request.args.get('sessionId')
        if not session_id:
            return jsonify({'success': False, 'error': "Missing sessionId"}), 400

        # Create Google Cloud Storage
        google_cloud_config = session_store.gcs_config
        bucket_name = session_store.get_bucket_name(session_id)

        bucket = create_google_cloud_storage_bucket(bucket_name=bucket_name,
                                                    google_cloud_config=google_cloud_config)

        if bucket is None:
            return jsonify({'success': False,
                            'error': f"Failed to create storage bucket '{bucket_name}'. Check billing or IAM permissions"}), 500

        # Add bucket to session store
        session_store.set_bucket(session_id=session_id, bucket=bucket)

        return jsonify({'success': True,
                        'message': f"Google cloud Storage bucket "
                                   f"{bucket_name} created successfully."}), 201

    except Exception as e:
        logger.exception("Unhandled error while creating bucket.")
        return jsonify({'success': False, 'error': str(e)}), 500


@gcs_management.route('/gcs/create_folders_in_bucket', methods=['POST'])
def create_directories_in_bucket():
    """Create folders within a GCS bucket."""
    try:
        session_id = request.args.get('sessionId')

        google_cloud_config = session_store.gcs_config
        bucket_name = session_store.get_bucket_name(session_id=session_id)
        success = create_folders_in_bucket(session_id=session_id,
                                           directories=google_cloud_config.gcs_directories)

        if success:
            return jsonify({'success': True,
                            'message': f"Directories created in bucket '{bucket_name}'"}), 201
        else:
            return jsonify({'success': False,
                            'message': f"Failed to create directories in bucket '{bucket_name}'"}), 400

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@gcs_management.route('/gcs/delete_bucket', methods=['DELETE'])
def delete_bucket():
    try:
        # Delete Google cloud storage bucket.
        session_id = request.args.get('sessionId')
        bucket_name = session_store.get_bucket_name(session_id=session_id)

        bucket_deleted = delete_google_cloud_storage_bucket(
            session_id=session_id)

        if bucket_deleted:
            session_store.clear_bucket(session_id=session_id)
            session_store.clear_signed_url_bucket(session_id=session_id)
            return jsonify({'success': True,
                            'message': f"Google Cloud Storage bucket "
                                       f"{bucket_name} deleted successfully. "}), 200
        return jsonify({'success': False,
                        'message': f"Google Cloud Storage bucket "
                                   f"{bucket_name} does not exist. "}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@gcs_management.route('/gcs/resized_original_images/delete', methods=['DELETE'])
def delete_uploaded_images():
    """
    Delete the uploaded images from the 'images' folder
    :return:
    """

    try:
        session_id = request.args.get('sessionId')
        google_cloud_config = session_store.gcs_config

        delete_and_recreate_directories_in_gcs_bucket(session_id=session_id,
                                                      directories=[google_cloud_config.resized_image_dir,])

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
        session_id = request.args.get('sessionId')
        google_cloud_config = session_store.gcs_config

        delete_and_recreate_directories_in_gcs_bucket(session_id=session_id,
                                                      directories=[google_cloud_config.resized_mask_dir, ])

        return jsonify({'success': True,
                        'message': 'Successfully deleted uploaded masks in Google Cloud Storage Bucket'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
