from datetime import timedelta

from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename

from app.config import google_cloud_config
from app.services import generate_signed_url
from app.utils import get_sorted_filenames, directory_store

signed_download_urls = Blueprint('signed_download_urls', __name__)

# Global Cache to store signed URLs
cached_signed_urls_for_uploaded_data = None
cached_signed_urls_for_train_set = None
cached_signed_urls_for_val_set = None
cached_signed_urls_for_test_set = None


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
            url = generate_signed_url(f"{google_cloud_config.augmented_dir}/{secure_file}")

            signed_urls.append({"filename": filename, "url": url})

        return jsonify({'success': True,
                        'count': len(signed_urls),
                        'results': signed_urls}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@signed_download_urls.route('/generate-signed-urls-for-resized-images-and-masks', methods=['GET'])
def generate_signed_urls_for_resized_images_and_masks(refresh=True):
    """Generate signed url for downloading the resized uploaded images and masks from GCS bucket."""

    global cached_signed_urls_for_uploaded_data
    if cached_signed_urls_for_uploaded_data and not refresh:
        return cached_signed_urls_for_uploaded_data  # Return cached URLs if already generated

    try:
        image_names = get_sorted_filenames(directory_path=directory_store.image_dir)
        mask_names = get_sorted_filenames(directory_path=directory_store.mask_dir)

        if not image_names or not mask_names:
            return []

        signed_urls = []
        for image_name, mask_name in zip(image_names, mask_names):
            secure_image_name = secure_filename(image_name)
            secure_mask_name = secure_filename(mask_name)

            image_url = generate_signed_url(f"{google_cloud_config.resized_image_dir}/{secure_image_name}")
            mask_url = generate_signed_url(f"{google_cloud_config.resized_mask_dir}/{secure_mask_name}")

            signed_urls.append({"image": {"name": image_name, "url": image_url},
                                "mask": {"name": mask_name, "url": mask_url}})

        # Store in cache
        cached_signed_urls_for_uploaded_data = signed_urls

        return signed_urls

    except Exception as e:
        print(f"Error generating signed urls for resized original images and masks: {e}")
        return []


@signed_download_urls.route('/generate-signed-urls-for-resized-augmented-train-set', methods=['GET'])
def generate_signed_urls_for_resized_train_set(refresh=True):
    """Generate signed url for downloading the resized training images and masks from GCS bucket."""

    global cached_signed_urls_for_train_set

    if cached_signed_urls_for_train_set and not refresh:
        return cached_signed_urls_for_train_set  # Return cached URLs if already generated

    try:
        image_names = get_sorted_filenames(directory_path=directory_store.train_image_dir)
        mask_names = get_sorted_filenames(directory_path=directory_store.train_mask_dir)

        if not image_names or not mask_names:
            return []

        signed_urls = []
        for image_name, mask_name in zip(image_names, mask_names):
            secure_image_name = secure_filename(image_name)
            secure_mask_name = secure_filename(mask_name)

            image_url = generate_signed_url(f"{google_cloud_config.resized_train_images_dir}/{secure_image_name}")
            mask_url = generate_signed_url(f"{google_cloud_config.resized_train_masks_dir}/{secure_mask_name}")

            signed_urls.append({"image": {"name": image_name, "url": image_url},
                                "mask": {"name": mask_name, "url": mask_url}})

        # Store in cache
        cached_signed_urls_for_train_set = signed_urls

        return signed_urls

    except Exception as e:
        print(f"Error generating signed urls for resized training set: {e}")
        return []


@signed_download_urls.route('/generate-signed-urls-for-resized-augmented-validation-set', methods=['GET'])
def generate_signed_urls_for_resized_validation_set(refresh=True):
    """Generate signed url for downloading the resized augmented validation images and masks from GCS bucket."""
    global cached_signed_urls_for_val_set

    if cached_signed_urls_for_val_set and not refresh:
        return cached_signed_urls_for_val_set  # Return cached URLs if already generated

    try:
        image_names = get_sorted_filenames(directory_path=directory_store.val_image_dir)
        mask_names = get_sorted_filenames(directory_path=directory_store.val_mask_dir)

        if not image_names or not mask_names:
            return []

        signed_urls = []
        for image_name, mask_name in zip(image_names, mask_names):
            secure_image_name = secure_filename(image_name)
            secure_mask_name = secure_filename(mask_name)

            image_url = generate_signed_url(f"{google_cloud_config.resized_val_images_dir}/{secure_image_name}")
            mask_url = generate_signed_url(f"{google_cloud_config.resized_val_masks_dir}/{secure_mask_name}")

            signed_urls.append({"image": {"name": image_name, "url": image_url},
                                "mask": {"name": mask_name, "url": mask_url}})

        # Store in cache
        cached_signed_urls_for_val_set = signed_urls

        return signed_urls

    except Exception as e:
        print(f"Error generating signed urls for resized validation set: {e}")
        return []


@signed_download_urls.route('/generate-signed-urls-for-resized-augmented-test-set', methods=['GET'])
def generate_signed_urls_for_resized_test_set(refresh=True):
    """Generate signed url for downloading the resized augmented test images and masks from GCS bucket."""
    global cached_signed_urls_for_test_set

    if cached_signed_urls_for_test_set and not refresh:
        return cached_signed_urls_for_test_set  # Return cached URLs if already generated

    try:
        image_names = get_sorted_filenames(directory_path=directory_store.test_image_dir)
        mask_names = get_sorted_filenames(directory_path=directory_store.test_mask_dir)

        if not image_names or not mask_names:
            return []

        signed_urls = []
        for image_name, mask_name in zip(image_names, mask_names):
            secure_image_name = secure_filename(image_name)
            secure_mask_name = secure_filename(mask_name)

            image_url = generate_signed_url(f"{google_cloud_config.resized_test_images_dir}/{secure_image_name}")
            mask_url = generate_signed_url(f"{google_cloud_config.resized_test_masks_dir}/{secure_mask_name}")

            signed_urls.append({"image": {"name": image_name, "url": image_url},
                                "mask": {"name": mask_name, "url": mask_url}})

        # Store in cache
        cached_signed_urls_for_test_set = signed_urls

        return signed_urls

    except Exception as e:
        print(f"Error generating signed urls for resized testing set: {e}")
        return []


