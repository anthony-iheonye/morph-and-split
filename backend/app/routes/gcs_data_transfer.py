import gc
import logging
import os.path

from flask import Blueprint, jsonify, request
from tensorflow.keras.backend import clear_session

from app.services import session_store
from app.services.gcs_client import upload_file_to_gcs_bucket, download_files_from_gcs_folder, \
    upload_files_to_gcs_bucket

logger = logging.getLogger(__name__)

transfer_data_to_gcs = Blueprint(name='transfer_data_to_gcs', import_name=__name__)

download_data_from_gcs = Blueprint(name='download_data_from_gcs',
                                   import_name=__name__)


@transfer_data_to_gcs.route('/gcs/transfer_augmented_zip_to_gcs', methods=['POST'])
def transfer_augmented_zip_to_gcs():
    """
    Uploads the augmented_data.zip file to the GCS bucket for the current session.

    Expects sessionId as a query parameter. If the file exists in the backend's
    augmented directory, it is uploaded to the appropriate bucket and folder in GCS.

    Returns:
        JSON response indicating success or failure.
    """

    session_id = request.args.get('sessionId')
    directory_store = session_store.get_directory_store(session_id=session_id)
    augmented_dir = directory_store.augmented
    filename = 'augmented_data.zip'

    try:
        if os.path.exists(os.path.join(augmented_dir, filename)):
            google_cloud_config = session_store.gcs_config
            destination_blob_name = google_cloud_config.augmented_dir + '/' + filename
            source_file_name = os.path.join(augmented_dir, filename)

            upload_file_to_gcs_bucket(session_id=session_id,
                                      source_file_name= source_file_name,
                                      destination_blob_name=destination_blob_name)

            return jsonify({'success': True,
                            'message': f"{source_file_name} uploaded to GCS bucket as {destination_blob_name}"}), 200

        else:
            return jsonify({'success': False,
                            'message': f"'{filename}', the file containing augmented results,"
                                       f" was not found in the backend."}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@transfer_data_to_gcs.route('/gcs/transfer_resized_augmented_data_to_gcs', methods=['POST'])
def transfer_resized_augmented_data():
    """
    Uploads resized augmented images and masks to the GCS bucket.

    Requires sessionId in query. Transfers files from resized_augmented directory
    to the configured GCS folder.

    Returns:
        JSON response indicating the upload result.
    """

    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id=session_id)
        google_cloud_config = session_store.gcs_config
        bucket_name = session_store.get_bucket_name(session_id=session_id)

        upload_files_to_gcs_bucket(bucket_name=bucket_name,
                                   source_folder_path=directory_store.resized_augmented,
                                   destination_folder_path=google_cloud_config.resized_augmented,
                                   copy=False)

        return jsonify({'success': True, 'message': "Successfully transferred resized original masks to bucket."}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

    finally:
        clear_session()
        gc.collect()


@transfer_data_to_gcs.route('/gcs/transfer_resized_original_images_to_gcs', methods=['POST'])
def transfer_resized_original_images():
    """
    Uploads resized original images to the GCS bucket.

    Requires sessionId in query. Transfers files from resized_image_dir
    to the configured GCS folder.

    Returns:
        JSON response indicating the upload result.
    """
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id=session_id)
        google_cloud_config = session_store.gcs_config
        bucket_name = session_store.get_bucket_name(session_id=session_id)

        upload_files_to_gcs_bucket(bucket_name=bucket_name,
                                   source_folder_path=directory_store.resized_image_dir,
                                   destination_folder_path=google_cloud_config.resized_image_dir,
                                   copy=False)

        return jsonify({'success': True, 'message': "Successfully transferred resized original images to bucket."}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

    finally:
        clear_session()
        gc.collect()


@transfer_data_to_gcs.route('/gcs/transfer_resized_original_masks_to_gcs', methods=['POST'])
def transfer_resized_original_masks():
    """
    Uploads resized original masks to the GCS bucket.

    Requires sessionId in query. Transfers files from resized_mask_dir
    to the configured GCS folder.

    Returns:
        JSON response indicating the upload result.
    """
    try:
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id=session_id)
        google_cloud_config = session_store.gcs_config
        bucket_name = session_store.get_bucket_name(session_id=session_id)

        upload_files_to_gcs_bucket(bucket_name=bucket_name,
                                   source_folder_path=directory_store.resized_mask_dir,
                                   destination_folder_path=google_cloud_config.resized_mask_dir,
                                   copy=False)

        return jsonify({'success': True, 'message': "Successfully transferred resized original masks to bucket."}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

    finally:
        clear_session()
        gc.collect()


@download_data_from_gcs.route('/gcs/transfer_images_to_backend', methods=['POST'])
def get_images_from_gcs():
    """
    Downloads uploaded images from GCS to the backend.

    Requires sessionId in query. Downloads from image_dir in GCS to local image_dir.

    Returns:
        JSON response indicating success or failure.
    """
    try:
        # Download the uploaded images from Google Cloud Storage
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id=session_id)
        google_cloud_config = session_store.gcs_config
        bucket_name = session_store.get_bucket_name(session_id=session_id)

        success, message = download_files_from_gcs_folder(bucket_name=bucket_name,
                                                          source_folder_path=google_cloud_config.image_dir,
                                                          destination_folder_path=directory_store.image_dir,
                                                          copy=False)

        if success:
            return jsonify({'success': True, 'message': message}), 200
        else:
            return jsonify({'success': False, 'error': message}), 500

    except Exception as e:
        logger.exception('Unexpected error while downloading images from GCS.')
        return jsonify({'success': False, 'error': str(e)}), 500

    finally:
        clear_session()
        gc.collect()


@download_data_from_gcs.route('/gcs/transfer_masks_to_backend', methods=['POST'])
def get_masks_from_gcs():
    """
    Downloads uploaded masks from GCS to the backend.

    Requires sessionId in query. Downloads from mask_dir in GCS to local mask_dir.

    Returns:
        JSON response indicating success or failure.
    """
    try:
        # Download the uploaded masks from Google Cloud Storage
        session_id = request.args.get('sessionId')
        directory_store = session_store.get_directory_store(session_id=session_id)
        google_cloud_config = session_store.gcs_config
        bucket_name = session_store.get_bucket_name(session_id=session_id)

        success, message = download_files_from_gcs_folder(bucket_name=bucket_name,
                                                          source_folder_path=google_cloud_config.mask_dir,
                                                          destination_folder_path=directory_store.mask_dir,
                                                          copy=False)

        if success:
            return jsonify({'success': True, 'message': message}), 200
        else:
            return jsonify({'success': False, 'error': message}), 500

    except Exception as e:
        logger.exception('Unexpected error while downloading masks from GCS.')
        return jsonify({'success': False, 'error': str(e)}), 500

    finally:
        clear_session()
        gc.collect()
