from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename

from app.config import google_cloud_config
from app.services import generate_signed_url
from app.utils import get_sorted_filenames, directory_store

signed_download_urls = Blueprint('signed_download_urls', __name__)

# Global Cache to store signed URLs
SIGNED_RESIZED_IMAGE_MASK_URLS = None
SIGNED_TRAINING_SET_URLS = None
SIGNED_VALIDATION_SET_URLS = None
SIGNED_TESTING_SET_URLS = None


@signed_download_urls.route('/generate-signed-download-url', methods=['GET'])
def generate_signed_download_urls():
    """
    Generates a v4 signed URL for downloading the zipped augmented result, from Google Cloud Storage, using HTTP GET request.
    """
    try:
        filenames = request.args.getlist('filenames')

        if not filenames:
            return jsonify({'success': False, 'error': "Filename parameter is required"}), 400


        signed_urls = []
        for filename in filenames:
            secure_file = secure_filename(filename)
            url = generate_signed_url(
                blob_name = f"{google_cloud_config.augmented_dir}/{secure_file}",
                google_cloud_config = google_cloud_config,)

            signed_urls.append({"filename": filename, "url": url})

        return jsonify({'success': True,
                        'count': len(signed_urls),
                        'results': signed_urls}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@signed_download_urls.route('/generate-signed-urls-for-resized-images-and-masks', methods=['GET'])
def generate_signed_urls_for_resized_images_and_masks():
    """Generate signed url for downloading the resized uploaded images and masks from GCS bucket."""

    global SIGNED_RESIZED_IMAGE_MASK_URLS

    if SIGNED_RESIZED_IMAGE_MASK_URLS is not None:
        print(f"Returning signed URLs for resized images and masks")
        return SIGNED_RESIZED_IMAGE_MASK_URLS  # Return cached URLs if already generated

    try:
        image_names = get_sorted_filenames(directory_path=directory_store.image_dir)
        mask_names = get_sorted_filenames(directory_path=directory_store.mask_dir)

        if not image_names or not mask_names:
            return []

        signed_urls = []
        for image_name, mask_name in zip(image_names, mask_names):
            secure_image_name = secure_filename(image_name)
            secure_mask_name = secure_filename(mask_name)

            image_url = generate_signed_url(
                blob_name = f"{google_cloud_config.resized_image_dir}/{secure_image_name}",
                google_cloud_config=google_cloud_config)
            mask_url = generate_signed_url(
                blob_name = f"{google_cloud_config.resized_mask_dir}/{secure_mask_name}",
                google_cloud_config=google_cloud_config)

            signed_urls.append({"image": {"name": image_name, "url": image_url},
                                "mask": {"name": mask_name, "url": mask_url}})

        # Store in cache
        SIGNED_RESIZED_IMAGE_MASK_URLS = signed_urls

        return signed_urls

    except Exception as e:
        print(f"Error generating signed urls for resized original images and masks: {e}")
        return []


@signed_download_urls.route('/generate-signed-urls-for-resized-augmented-train-set', methods=['GET'])
def generate_signed_urls_for_resized_train_set():
    """Generate signed url for downloading the resized training images and masks from GCS bucket."""

    global SIGNED_TRAINING_SET_URLS

    if SIGNED_TRAINING_SET_URLS and not None:
        print(f"Returning signed URLs for resized training images and masks")
        return SIGNED_TRAINING_SET_URLS  # Return cached URLs if already generated

    try:
        image_names = get_sorted_filenames(directory_path=directory_store.train_image_dir)
        mask_names = get_sorted_filenames(directory_path=directory_store.train_mask_dir)

        if not image_names or not mask_names:
            return []

        signed_urls = []
        for image_name, mask_name in zip(image_names, mask_names):
            secure_image_name = secure_filename(image_name)
            secure_mask_name = secure_filename(mask_name)

            image_url = generate_signed_url(
                blob_name = f"{google_cloud_config.resized_train_images_dir}/{secure_image_name}",
                google_cloud_config=google_cloud_config)
            mask_url = generate_signed_url(
                blob_name = f"{google_cloud_config.resized_train_masks_dir}/{secure_mask_name}",
                google_cloud_config=google_cloud_config)

            signed_urls.append({"image": {"name": image_name, "url": image_url},
                                "mask": {"name": mask_name, "url": mask_url}})

        # Store in cache
        SIGNED_TRAINING_SET_URLS = signed_urls

        return signed_urls

    except Exception as e:
        print(f"Error generating signed urls for resized training set: {e}")
        return []


@signed_download_urls.route('/generate-signed-urls-for-resized-augmented-validation-set', methods=['GET'])
def generate_signed_urls_for_resized_validation_set():
    """Generate signed url for downloading the resized augmented validation images and masks from GCS bucket."""
    global SIGNED_VALIDATION_SET_URLS

    if SIGNED_VALIDATION_SET_URLS and not None:
        print(f"Returning signed URLs for resized validation images and masks")
        return SIGNED_VALIDATION_SET_URLS  # Return cached URLs if already generated

    try:
        image_names = get_sorted_filenames(directory_path=directory_store.val_image_dir)
        mask_names = get_sorted_filenames(directory_path=directory_store.val_mask_dir)

        if not image_names or not mask_names:
            return []

        signed_urls = []
        for image_name, mask_name in zip(image_names, mask_names):
            secure_image_name = secure_filename(image_name)
            secure_mask_name = secure_filename(mask_name)

            image_url = generate_signed_url(
                blob_name=f"{google_cloud_config.resized_val_images_dir}/{secure_image_name}",
                google_cloud_config=google_cloud_config)
            mask_url = generate_signed_url(
                blob_name=f"{google_cloud_config.resized_val_masks_dir}/{secure_mask_name}",
                google_cloud_config=google_cloud_config)

            signed_urls.append({"image": {"name": image_name, "url": image_url},
                                "mask": {"name": mask_name, "url": mask_url}})

        # Store in cache
        SIGNED_VALIDATION_SET_URLS = signed_urls

        return signed_urls

    except Exception as e:
        print(f"Error generating signed urls for resized validation set: {e}")
        return []


@signed_download_urls.route('/generate-signed-urls-for-resized-augmented-test-set', methods=['GET'])
def generate_signed_urls_for_resized_test_set():
    """Generate signed url for downloading the resized augmented test images and masks from GCS bucket."""
    global SIGNED_TESTING_SET_URLS

    if SIGNED_TESTING_SET_URLS and not None:
        print(f"Returning signed URLs for resized test images and masks")
        return SIGNED_TESTING_SET_URLS  # Return cached URLs if already generated

    try:
        image_names = get_sorted_filenames(directory_path=directory_store.test_image_dir)
        mask_names = get_sorted_filenames(directory_path=directory_store.test_mask_dir)

        if not image_names or not mask_names:
            return []

        signed_urls = []
        for image_name, mask_name in zip(image_names, mask_names):
            secure_image_name = secure_filename(image_name)
            secure_mask_name = secure_filename(mask_name)

            image_url = generate_signed_url(
                blob_name=f"{google_cloud_config.resized_test_images_dir}/{secure_image_name}",
                google_cloud_config=google_cloud_config)
            mask_url = generate_signed_url(
                blob_name=f"{google_cloud_config.resized_test_masks_dir}/{secure_mask_name}",
                google_cloud_config=google_cloud_config)

            signed_urls.append({"image": {"name": image_name, "url": image_url},
                                "mask": {"name": mask_name, "url": mask_url}})

        # Store in cache
        SIGNED_TESTING_SET_URLS = signed_urls

        return signed_urls

    except Exception as e:
        print(f"Error generating signed urls for resized testing set: {e}")
        return []


@signed_download_urls.route('/reset-signed-urls-for-resized-images-and-masks', methods=['POST'])
def reset_signed_urls_for_resized_images_and_masks():
    global SIGNED_RESIZED_IMAGE_MASK_URLS

    try:
        SIGNED_RESIZED_IMAGE_MASK_URLS = None
        return jsonify({'success': True, 'message': f"Success resetting signed urls for resized images and masks"})

    except Exception as e:
        return jsonify({'success': False, 'message': f"Error resetting signed urls for resized images and masks: {e}"})


@signed_download_urls.route('/reset-signed-urls-for-resized-train-set', methods=['POST'])
def reset_signed_urls_for_resized_train_set():
    global SIGNED_TRAINING_SET_URLS

    try:
        SIGNED_TRAINING_SET_URLS = None
        return jsonify({'success': True, 'message': f"Success resetting signed urls for resized training set"})

    except Exception as e:
        return jsonify({'success': False, 'message': f"Error resetting signed urls for resized training set: {e}"})


@signed_download_urls.route('/reset-signed-urls-for-resized-validation-set', methods=['POST'])
def reset_signed_urls_for_resized_validation_set():
    global SIGNED_VALIDATION_SET_URLS

    try:
        SIGNED_VALIDATION_SET_URLS = None
        return jsonify({'success': True, 'message': f"Success resetting signed urls for resized validation set."})

    except Exception as e:
        return jsonify({'success': False, 'message': f"Error resetting signed urls for resized validation set.: {e}"})


@signed_download_urls.route('/reset-signed-urls-for-resized-test-set', methods=['POST'])
def reset_signed_urls_for_resized_test_set():
    global SIGNED_TESTING_SET_URLS

    try:
        SIGNED_TESTING_SET_URLS = None
        return jsonify({'success': True, 'message': f"Success resetting signed urls for resized testing set"})

    except Exception as e:
        return jsonify({'success': False, 'message': f"Error resetting signed urls for resized testing set: {e}"})


