import gc

from flask import Blueprint, jsonify
from tensorflow.keras.backend import clear_session

from app.config import google_cloud_config
from app.utils import download_files_from_gcs_folder, directory_store

download_uploaded_masks_from_gcs = Blueprint(name='download_uploaded_masks_from_gcs',
                                             import_name=__name__)


@download_uploaded_masks_from_gcs.route('/transfer_masks_to_backend', methods=['GET'])
def get_masks_from_gcs():
    try:
        # Download the uploaded masks from Google Cloud Storage
        download_files_from_gcs_folder(bucket_name=google_cloud_config.bucket_name,
                                       source_folder_path=google_cloud_config.mask_dir,
                                       destination_folder_path=directory_store.mask_dir)


        return jsonify({'success': True, 'message': 'Successfully downloaded masks to backend.'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        clear_session()
        gc.collect()

