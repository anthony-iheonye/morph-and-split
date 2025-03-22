import gc
import os.path
import logging

from flask import Blueprint, jsonify
from tensorflow.keras.backend import clear_session

from app.config import get_google_cloud_config
from app.utils import directory_store
from app.services.gcs_client import upload_file_to_gcs_bucket, download_files_from_gcs_folder, \
    upload_files_to_gcs_bucket

logger = logging.getLogger(__name__)

transfer_data_to_gcs = Blueprint(name='transfer_data_to_gcs', import_name=__name__)

download_data_from_gcs = Blueprint(name='download_data_from_gcs',
                                   import_name=__name__)

AUGMENTED_DIR = directory_store.augmented


@transfer_data_to_gcs.route('/gcs/transfer_augmented_zip_to_gcs', methods=['POST'])
def transfer_augmented_zip_to_gcs():
    """uploads the zip file containing augmented results to Google Cloud storage bucket """
    # filename = secure_filename(filename)

    filename = 'augmented_data.zip'

    try:
        if os.path.exists(os.path.join(AUGMENTED_DIR, filename)):
            google_cloud_config = get_google_cloud_config()
            destination_blob_name = google_cloud_config.augmented_dir + '/' + filename
            source_file_name = os.path.join(AUGMENTED_DIR, filename)

            upload_file_to_gcs_bucket(source_file_name= source_file_name,
                                      destination_blob_name=destination_blob_name,
                                      google_cloud_config=google_cloud_config)

            return jsonify({'success': True,
                            'message': f"{source_file_name} uploaded to GCS bucket as {destination_blob_name}"}), 200

        else:
            return jsonify({'success': False,
                            'message': f"{filename} was not found"}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@transfer_data_to_gcs.route('/gcs/transfer_resized_augmented_data_to_gcs', methods=['POST'])
def transfer_resized_augmented_data():
    """
    Transfer the resized augmented images and masks to Google Cloud bucket
    """
    try:
        google_cloud_config = get_google_cloud_config()
        upload_files_to_gcs_bucket(bucket_name=google_cloud_config.bucket_name,
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
    Transfer the resized original images and mask to Google Cloud bucket
    """
    try:
        google_cloud_config = get_google_cloud_config()
        upload_files_to_gcs_bucket(bucket_name=google_cloud_config.bucket_name,
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
    Transfer the resized original images and mask to Google Cloud bucket
    """
    try:
        google_cloud_config = get_google_cloud_config()
        upload_files_to_gcs_bucket(bucket_name=google_cloud_config.bucket_name,
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
    try:
        # Download the uploaded images from Google Cloud Storage
        google_cloud_config = get_google_cloud_config()
        success, message = download_files_from_gcs_folder(bucket_name=google_cloud_config.bucket_name,
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
    try:
        # Download the uploaded masks from Google Cloud Storage
        google_cloud_config = get_google_cloud_config()
        success, message = download_files_from_gcs_folder(bucket_name=google_cloud_config.bucket_name,
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
