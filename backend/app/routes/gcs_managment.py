from flask import Blueprint, jsonify

from app.config import google_cloud_config, DIRECTORIES
from app.services import create_google_cloud_storage_bucket
from app.services.gcs_client import delete_and_recreate_directories_in_gcs_bucket, delete_google_cloud_storage_bucket

# Blueprint definition
gcs_management = Blueprint('gcs_management', __name__)

@gcs_management.route('/gcs/create_bucket', methods=['POST'])
def create_bucket():
    try:

        # Create Google Cloud Storage
        bucket = create_google_cloud_storage_bucket(directories=DIRECTORIES,
                                                    google_cloud_config=google_cloud_config)

        if bucket is not None:
            return jsonify({'success': True,
                            'message': f"Google cloud Storage bucket "
                                       f"{google_cloud_config.bucket_name} created successfully."}), 201
        else:
            return jsonify({'success': False,
                            'message': f"Failed to created Storge bucket "
                                       f"{google_cloud_config.bucket_name} "}), 400
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

