from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename

from app.services import generate_signed_url, session_store
from app.utils import get_sorted_filenames

google_cloud_signed_urls = Blueprint('signed_urls', __name__)


@google_cloud_signed_urls.route('/generate-signed-download-url', methods=['GET'])
def generate_signed_download_urls():
    """
    Generates a v4 signed URL for downloading the zipped augmented result, from Google Cloud Storage, using HTTP GET request.
    """
    try:
        session_id = request.args.get('sessionId')
        filenames = request.args.getlist('filenames')

        if not filenames:
            return jsonify({'success': False, 'error': "Filename parameter is required"}), 400

        signed_urls = []
        google_cloud_config = session_store.gcs_config
        for filename in filenames:
            secure_file = secure_filename(filename)
            url = generate_signed_url(
                session_id=session_id,
                blob_name = f"{google_cloud_config.augmented_dir}/{secure_file}",
                )

            signed_urls.append({"filename": filename, "url": url})

        return jsonify({'success': True,
                        'count': len(signed_urls),
                        'results': signed_urls}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@google_cloud_signed_urls.route('/generate-signed-upload-url', methods=['POST'])
def generate_signed_upload_urls():
    """
    Generates a v4 signed URL for uploading data files to Google Cloud Storage, using HTTP PUT request.
    """
    try:
        data = request.json
        filenames = data.get('filenames', [])
        content_types = data.get('content_types', [])
        folder_path = data.get('folder_path', '')
        session_id = request.args.get('sessionId')

        signed_urls = []

        for i, filename in enumerate(filenames):
            # Use corresponding type if provided; default to application/octet-stream
            content_type = content_types[i] if i < len(content_types) else 'application/octet-stream'

            url = generate_signed_url(session_id=session_id,
                                      blob_name=f"{folder_path}/{filename}",
                                      method="PUT",
                                      content_type=content_type)

            signed_urls.append({"filename": filename, "url": url, "content_type": content_type})

        return jsonify({'success': True,
                        'count': len(signed_urls),
                        'results': signed_urls}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def generate_signed_urls_for_resized_images_and_masks(session_id: str):
    """Generate signed url for downloading the resized uploaded images and masks from GCS bucket."""

    signed_resized_image_mask_urls = session_store.get_signed_resized_image_mask_urls(session_id=session_id)

    if signed_resized_image_mask_urls is not None:
        print(f"Returning cached signed URLs for resized images and masks")
        return signed_resized_image_mask_urls  # Return cached URLs if already generated

    try:
        directory_store = session_store.get_directory_store(session_id=session_id)
        image_names = get_sorted_filenames(directory_path=directory_store.image_dir)
        mask_names = get_sorted_filenames(directory_path=directory_store.mask_dir)

        if not image_names or not mask_names:
            return []

        signed_urls = []
        google_cloud_config = session_store.gcs_config
        for image_name, mask_name in zip(image_names, mask_names):
            secure_image_name = secure_filename(image_name)
            secure_mask_name = secure_filename(mask_name)

            image_url = generate_signed_url(
                session_id=session_id,
                blob_name = f"{google_cloud_config.resized_image_dir}/{secure_image_name}")

            mask_url = generate_signed_url(
                session_id=session_id,
                blob_name = f"{google_cloud_config.resized_mask_dir}/{secure_mask_name}")

            signed_urls.append({"image": {"name": image_name, "url": image_url},
                                "mask": {"name": mask_name, "url": mask_url}})

        # Store in cache
        session_store.set_signed_resized_image_mask_urls(session_id=session_id,
                                                         urls=signed_urls)

        return signed_urls

    except Exception as e:
        print(f"Error generating signed urls for resized original images and masks: {e}")
        return []


def generate_signed_urls_for_resized_train_set(session_id: str):
    """Generate signed url for downloading the resized training images and masks from GCS bucket."""

    signed_training_set_urls = session_store.get_signed_training_set_urls(session_id=session_id)

    if signed_training_set_urls is not None:
        print(f"Returning cached signed URLs for resized training images and masks")
        return signed_training_set_urls  # Return cached URLs if already generated

    try:
        directory_store = session_store.get_directory_store(session_id=session_id)
        image_names = get_sorted_filenames(directory_path=directory_store.train_image_dir)
        mask_names = get_sorted_filenames(directory_path=directory_store.train_mask_dir)

        if not image_names or not mask_names:
            return []

        signed_urls = []
        google_cloud_config = session_store.gcs_config
        for image_name, mask_name in zip(image_names, mask_names):
            secure_image_name = secure_filename(image_name)
            secure_mask_name = secure_filename(mask_name)

            image_url = generate_signed_url(
                session_id=session_id,
                blob_name = f"{google_cloud_config.resized_train_images_dir}/{secure_image_name}")

            mask_url = generate_signed_url(
                session_id=session_id,
                blob_name = f"{google_cloud_config.resized_train_masks_dir}/{secure_mask_name}")

            signed_urls.append({"image": {"name": image_name, "url": image_url},
                                "mask": {"name": mask_name, "url": mask_url}})

        # Store in cache
        session_store.set_signed_training_set_urls(session_id=session_id,
                                                   urls=signed_urls)
        return signed_urls

    except Exception as e:
        print(f"Error generating signed urls for resized training set: {e}")
        return []


def generate_signed_urls_for_resized_validation_set(session_id: str):
    """Generate signed url for downloading the resized augmented validation images and masks from GCS bucket."""

    signed_validation_set_urls = session_store.get_signed_validation_set_urls(session_id=session_id)

    if signed_validation_set_urls is not None:
        print(f"Returning cached signed URLs for resized validation images and masks")
        return signed_validation_set_urls  # Return cached URLs if already generated

    try:
        directory_store = session_store.get_directory_store(session_id=session_id)
        image_names = get_sorted_filenames(directory_path=directory_store.val_image_dir)
        mask_names = get_sorted_filenames(directory_path=directory_store.val_mask_dir)

        if not image_names or not mask_names:
            return []

        signed_urls = []
        google_cloud_config = session_store.gcs_config
        for image_name, mask_name in zip(image_names, mask_names):
            secure_image_name = secure_filename(image_name)
            secure_mask_name = secure_filename(mask_name)

            image_url = generate_signed_url(
                session_id=session_id,
                blob_name=f"{google_cloud_config.resized_val_images_dir}/{secure_image_name}")

            mask_url = generate_signed_url(
                session_id=session_id,
                blob_name=f"{google_cloud_config.resized_val_masks_dir}/{secure_mask_name}")

            signed_urls.append({"image": {"name": image_name, "url": image_url},
                                "mask": {"name": mask_name, "url": mask_url}})

        # Store in cache
        session_store.set_signed_validation_set_urls(session_id=session_id,
                                                     urls=signed_urls)
        return signed_urls

    except Exception as e:
        print(f"Error generating signed urls for resized validation set: {e}")
        return []


def generate_signed_urls_for_resized_test_set(session_id: str):
    """Generate signed url for downloading the resized augmented test images and masks from GCS bucket."""

    signed_test_set_urls = session_store.get_signed_test_set_urls(session_id=session_id)

    if signed_test_set_urls is not None:
        print(f"Returning cached signed URLs for resized test images and masks")
        return signed_test_set_urls  # Return cached URLs if already generated

    try:
        directory_store = session_store.get_directory_store(session_id=session_id)
        image_names = get_sorted_filenames(directory_path=directory_store.test_image_dir)
        mask_names = get_sorted_filenames(directory_path=directory_store.test_mask_dir)

        if not image_names or not mask_names:
            return []

        signed_urls = []
        google_cloud_config = session_store.gcs_config
        for image_name, mask_name in zip(image_names, mask_names):
            secure_image_name = secure_filename(image_name)
            secure_mask_name = secure_filename(mask_name)

            image_url = generate_signed_url(
                session_id=session_id,
                blob_name=f"{google_cloud_config.resized_test_images_dir}/{secure_image_name}")

            mask_url = generate_signed_url(
                session_id=session_id,
                blob_name=f"{google_cloud_config.resized_test_masks_dir}/{secure_mask_name}")

            signed_urls.append({"image": {"name": image_name, "url": image_url},
                                "mask": {"name": mask_name, "url": mask_url}})

        # Store in cache
        session_store.set_signed_test_set_urls(session_id=session_id,
                                               urls=signed_urls)

        return signed_urls

    except Exception as e:
        print(f"Error generating signed urls for resized testing set: {e}")
        return []


@google_cloud_signed_urls.route('/reset-signed-urls-for-resized-images-and-masks', methods=['POST'])
def reset_signed_urls_for_resized_images_and_masks():

    session_id = request.args.get('sessionId')

    try:
        session_store.reset_signed_urls_for_resized_images_and_masks(session_id=session_id)
        return jsonify({'success': True, 'message': f"Success resetting signed urls for resized images and masks"})

    except Exception as e:
        return jsonify({'success': False, 'message': f"Error resetting signed urls for resized images and masks: {e}"})


@google_cloud_signed_urls.route('/reset-signed-urls-for-resized-train-val-test-sets', methods=['POST'])
def reset_signed_urls_for_resized_train_val_test_sets():
    session_id = request.args.get('sessionId')

    try:
        session_store.reset_signed_urls_for_train_val_test_data(session_id=session_id)
        return jsonify({'success': True, 'message': f"Success resetting signed urls for resized training set"})

    except Exception as e:
        return jsonify({'success': False,
                        'message': f"Error resetting signed download urls for "
                                   f"resized training, validation and test set: {e}"})


@google_cloud_signed_urls.route('/reset-all-signed-download-urls', methods=['POST'])
def reset_all_signed_download_urls():
    session_id = request.args.get('sessionId')

    try:
        session_store.reset_all_signed_download_urls(session_id=session_id)
        return jsonify({'success': True, 'message': f"Success resetting signed download urls."})

    except Exception as e:
        return jsonify({'success': False, 'message': f"Error resetting all signed download urls: {e}"})


@google_cloud_signed_urls.route('/clear-all-signed-download-urls', methods=['POST'])
def clear_all_signed_download_urls():
    session_id = request.args.get('sessionId')

    try:
        session_store.clear_all_signed_download_urls(session_id=session_id)
        return jsonify({'success': True, 'message': f"Success deleting all signed download urls."})

    except Exception as e:
        return jsonify({'success': False, 'message': f"Error deleting all signed download urls: {e}"})


