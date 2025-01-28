import gc

from flask import Blueprint, jsonify
from tensorflow.keras.backend import clear_session

from app.config import google_cloud_config
from app.utils import download_files_from_gcs_folder, directory_store

download_data_from_gcs = Blueprint(name='download_data_from_gcs',
                                   import_name=__name__)


@download_data_from_gcs.route('/gcs/transfer_images_to_backend', methods=['POST'])
def get_images_from_gcs():
    try:
        # Download the uploaded images from Google Cloud Storage
        download_files_from_gcs_folder(bucket_name=google_cloud_config.bucket_name,
                                       source_folder_path=google_cloud_config.image_dir,
                                       destination_folder_path=directory_store.image_dir,
                                       copy=False)

        return jsonify({'success': True, 'message': 'Successfully downloaded images to backend.'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        clear_session()
        gc.collect()


@download_data_from_gcs.route('/gcs/transfer_masks_to_backend', methods=['POST'])
def get_masks_from_gcs():
    try:
        # Download the uploaded masks from Google Cloud Storage
        download_files_from_gcs_folder(bucket_name=google_cloud_config.bucket_name,
                                       source_folder_path=google_cloud_config.mask_dir,
                                       destination_folder_path=directory_store.mask_dir,
                                       copy=False)

        return jsonify({'success': True, 'message': 'Successfully downloaded masks to backend.'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        clear_session()
        gc.collect()
