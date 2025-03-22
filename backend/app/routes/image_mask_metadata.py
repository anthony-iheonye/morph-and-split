import os

from flask import Blueprint, jsonify, request
from flask import send_from_directory, url_for
from werkzeug.utils import secure_filename

from app.config import get_google_cloud_config
from app.routes.signed_urls import generate_signed_urls_for_resized_images_and_masks, \
    generate_signed_urls_for_resized_train_set, generate_signed_urls_for_resized_validation_set, \
    generate_signed_urls_for_resized_test_set
from app.services import generate_signed_url
from app.utils import get_sorted_filenames, directory_store

# Blueprint definition
image_mask_metadata = Blueprint('image_mask_metadata', __name__)

# directory definition
IMAGE_DIR = directory_store.resized_image_dir
MASK_DIR = directory_store.resized_mask_dir
RESIZED_TRAIN_IMAGE_DIR = directory_store.resized_train_image_dir
RESIZED_TRAIN_MASK_DIR = directory_store.resized_train_mask_dir
RESIZED_VAL_IMAGE_DIR = directory_store.resized_val_image_dir
RESIZED_VAL_MASK_DIR = directory_store.resized_val_mask_dir
RESIZED_TEST_IMAGE_DIR = directory_store.resized_test_image_dir
RESIZED_TEST_MASK_DIR = directory_store.resized_test_mask_dir


# Route to serve image files
def get_scheme():
    """Detect whether the app is running on Cloud Run or locally."""
    if os.getenv("K_SERVICE"):  # This environment variable exists in Cloud Run
        return "https"
    return "http"


@image_mask_metadata.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory(IMAGE_DIR, filename, mimetype='image/png')


@image_mask_metadata.route('/train_images/<filename>')
def serve_train_image(filename):
    return send_from_directory(RESIZED_TRAIN_IMAGE_DIR, filename, mimetype='image/png')


@image_mask_metadata.route('/val_images/<filename>')
def serve_val_image(filename):
    return send_from_directory(RESIZED_VAL_IMAGE_DIR, filename, mimetype='image/png')


@image_mask_metadata.route('/test_images/<filename>')
def serve_test_image(filename):
    return send_from_directory(RESIZED_TEST_IMAGE_DIR, filename, mimetype='image/png')


# Route to serve mask files
@image_mask_metadata.route('/masks/<filename>')
def serve_mask(filename):
    return send_from_directory(MASK_DIR, filename, mimetype='image/png')


@image_mask_metadata.route('/train_masks/<filename>')
def serve_train_mask(filename):
    return send_from_directory(RESIZED_TRAIN_MASK_DIR, filename, mimetype='image/png')


@image_mask_metadata.route('/val_masks/<filename>')
def serve_val_mask(filename):
    return send_from_directory(RESIZED_VAL_MASK_DIR, filename, mimetype='image/png')


@image_mask_metadata.route('/test_masks/<filename>')
def serve_test_mask(filename):
    return send_from_directory(RESIZED_TEST_MASK_DIR, filename, mimetype='image/png')


@image_mask_metadata.route('/metadata/uploaded_image_mask', methods=['GET'])
def get_image_mask_metadata():
    try:
        # Detect the scheme (http or https) dynamically
        # scheme = request.scheme
        scheme = get_scheme()

        # Pagination parameters
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 10))

        # Get sorted filenames for images and masks
        image_files = get_sorted_filenames(IMAGE_DIR)
        mask_files = get_sorted_filenames(MASK_DIR)

        # Ensure the number of images and mask align
        if len(image_files) != len(mask_files):
            return jsonify({'error': "Mismatch between number of original images and masks."}), 400

        # Paginate the data
        start = (page - 1) * page_size
        end = start + page_size
        paginated_images = image_files[start:end]
        paginated_masks = mask_files[start:end]

        metadata = []
        for image_name, mask_name in zip(paginated_images, paginated_masks):
            image_path = url_for('image_mask_metadata.serve_image',
                                 filename=image_name, _external=True, _scheme=scheme)
            mask_path = url_for('image_mask_metadata.serve_mask',
                                filename=mask_name, _external=True, _scheme=scheme)

            metadata.append({'image': {'name': image_name, 'url': image_path},
                             'mask': {'name': mask_name, 'url': mask_path}
                             })

        return jsonify({'count': len(metadata),
                        'next': False if end >= len(image_files) else True,
                        'results': metadata}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@image_mask_metadata.route('/metadata/train_images_masks', methods=['GET'])
def get_train_images_masks():
    try:
        # Detect the scheme (http or https) dynamically
        scheme = get_scheme()

        # Pagination parameters
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 10))

        # Get sorted filenames for images and masks
        image_files = get_sorted_filenames(RESIZED_TRAIN_IMAGE_DIR)
        mask_files = get_sorted_filenames(RESIZED_TRAIN_MASK_DIR)

        # Ensure the number of images and mask align
        if len(image_files) != len(mask_files):
            return jsonify({'error': "Mismatch between number of images and masks."}), 400

        # Paginate the data
        start = (page - 1) * page_size
        end = start + page_size
        paginated_images = image_files[start:end]
        paginated_masks = mask_files[start:end]

        metadata = []
        for image_name, mask_name in zip(paginated_images, paginated_masks):
            image_path = url_for('image_mask_metadata.serve_train_image',
                                 filename=image_name, _external=True, _scheme=scheme)
            mask_path = url_for('image_mask_metadata.serve_train_mask',
                                filename=mask_name, _external=True, _scheme=scheme)

            metadata.append({'image': {'name': image_name, 'url': image_path},
                             'mask': {'name': mask_name, 'url': mask_path}
                             })

        return jsonify({'count': len(metadata),
                        'next': False if end >= len(image_files) else True,
                        'results': metadata}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@image_mask_metadata.route('/metadata/val_images_masks', methods=['GET'])
def get_val_images_masks():
    try:
        # Detect the scheme (http or https) dynamically
        scheme = get_scheme()

        # Pagination parameters
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 10))

        # Get sorted filenames for images and masks
        image_files = get_sorted_filenames(RESIZED_VAL_IMAGE_DIR)
        mask_files = get_sorted_filenames(RESIZED_VAL_MASK_DIR)

        # Ensure the number of images and mask align
        if len(image_files) != len(mask_files):
            return jsonify({'error': "Mismatch between number of images and masks."}), 400

        # Paginate the data
        start = (page - 1) * page_size
        end = start + page_size
        paginated_images = image_files[start:end]
        paginated_masks = mask_files[start:end]

        metadata = []
        for image_name, mask_name in zip(paginated_images, paginated_masks):
            image_path = url_for(
                'image_mask_metadata.serve_val_image', filename=image_name, _external=True, _scheme=scheme)
            mask_path = url_for(
                'image_mask_metadata.serve_val_mask', filename=mask_name, _external=True, _scheme=scheme)

            metadata.append({'image': {'name': image_name, 'url': image_path},
                             'mask': {'name': mask_name, 'url': mask_path}
                             })

        return jsonify({'count': len(metadata),
                        'next': False if end >= len(image_files) else True,
                        'results': metadata}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@image_mask_metadata.route('/metadata/test_images_masks', methods=['GET'])
def get_test_images_masks():
    try:
        # Detect the scheme (http or https) dynamically
        scheme = get_scheme()

        # Pagination parameters
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 10))

        # Get sorted filenames for images and masks
        image_files = get_sorted_filenames(RESIZED_TEST_IMAGE_DIR)
        mask_files = get_sorted_filenames(RESIZED_TEST_MASK_DIR)

        # Ensure the number of images and mask align
        if len(image_files) != len(mask_files):
            return jsonify({'error': "Mismatch between number of test set images and masks."}), 400

        # Paginate the data
        start = (page - 1) * page_size
        end = start + page_size
        paginated_images = image_files[start:end]
        paginated_masks = mask_files[start:end]

        metadata = []
        for image_name, mask_name in zip(paginated_images, paginated_masks):
            image_path = url_for('image_mask_metadata.serve_test_image',
                                 filename=image_name, _external=True, _scheme=scheme)
            mask_path = url_for('image_mask_metadata.serve_test_mask',
                                filename=mask_name, _external=True, _scheme=scheme)

            metadata.append({'image': {'name': image_name, 'url': image_path},
                             'mask': {'name': mask_name, 'url': mask_path}
                             })

        return jsonify({'count': len(metadata),
                        'next': False if end >= len(image_files) else True,
                        'results': metadata}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@image_mask_metadata.route('/metadata/gcs/resized_original_images_masks_old', methods=['GET'])
def get_image_mask_metadata_from_gcs_old():
    """Fetch the metadata of the resized original images and masks in GCS bucket."""
    try:
        # Pagination parameters
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 10))

        image_names = get_sorted_filenames(directory_path=directory_store.image_dir)
        mask_names = get_sorted_filenames(directory_path=directory_store.mask_dir)

        # Ensure the number of images and mask align
        if len(image_names) != len(mask_names):
            return jsonify({'error': "Mismatch between number of original images and masks."}), 400

        # Paginate the data
        start = (page - 1) * page_size
        end = start + page_size
        paginated_images = image_names[start:end]
        paginated_masks = mask_names[start:end]

        # Generate signed URLs for each image/mask pair
        metadata = []
        google_cloud_config = get_google_cloud_config()
        for image_name, mask_name in zip(paginated_images, paginated_masks):
            secure_image_name = secure_filename(image_name)
            secure_mask_name = secure_filename(mask_name)

            image_url = generate_signed_url(
                blob_name=f"{google_cloud_config.resized_image_dir}/{secure_image_name}",
                google_cloud_config=google_cloud_config
            )
            mask_url = generate_signed_url(
                blob_name=f"{google_cloud_config.resized_mask_dir}/{secure_mask_name}",
                google_cloud_config=google_cloud_config
            )

            metadata.append({"image": {"name": image_name, "url": image_url},
                             "mask": {"name": mask_name, "url": mask_url}
                             })
        print(f"start: {start}\tend: {end}\t next: {len(image_names)}\tpaginated_metadata (length): {len(metadata)}")

        return jsonify({'count': len(metadata),
                        'next': end < len(image_names),
                        'results': metadata}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@image_mask_metadata.route('/metadata/gcs/resized_original_images_masks', methods=['GET'])
def get_image_mask_metadata_from_gcs():
    """Fetch the metadata of the resized original images and masks in GCS bucket."""
    try:
        # Pagination parameters
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 10))

        # Get signed URLs (cached)
        all_metadata = generate_signed_urls_for_resized_images_and_masks()

        if not all_metadata:
            return jsonify({'success': False, 'error': "No images/masks found."}), 400

        # Paginate results
        start = (page - 1) * page_size
        end = start + page_size
        paginated_metadata = all_metadata[start:end]

        return jsonify({'count': len(paginated_metadata),
                        'next': end < len(all_metadata),
                        'results': paginated_metadata}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@image_mask_metadata.route('/metadata/gcs/resized-train-set', methods=['GET'])
def get_resized_training_image_mask_metadata_from_gcs():
    """Fetch the metadata of the resized training images and masks from GCS bucket."""
    try:
        # Pagination parameters
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 10))

        # Get signed URLs (cached)
        all_metadata = generate_signed_urls_for_resized_train_set()

        if not all_metadata:
            return jsonify({'success': False, 'error': "No images/masks found."}), 400

        # Paginate results
        start = (page - 1) * page_size
        end = start + page_size
        paginated_metadata = all_metadata[start:end]

        return jsonify({'count': len(paginated_metadata),
                        'next': end < len(all_metadata),
                        'results': paginated_metadata}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@image_mask_metadata.route('/metadata/gcs/resized-val-set', methods=['GET'])
def get_resized_validation_image_mask_metadata_from_gcs():
    """Fetch the metadata of the resized validation images and masks from GCS bucket."""
    try:
        # Pagination parameters
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 10))

        # Get signed URLs (cached)
        all_metadata = generate_signed_urls_for_resized_validation_set()

        if not all_metadata:
            return jsonify({'success': False, 'error': "No images/masks found."}), 400

        # Paginate results
        start = (page - 1) * page_size
        end = start + page_size
        paginated_metadata = all_metadata[start:end]

        return jsonify({'count': len(paginated_metadata),
                        'next': end < len(all_metadata),
                        'results': paginated_metadata}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@image_mask_metadata.route('/metadata/gcs/resized-test-set', methods=['GET'])
def get_resized_test_image_mask_metadata_from_gcs():
    """Fetch the metadata of the resized testing images and masks from GCS bucket."""
    try:
        # Pagination parameters
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 10))

        # Get signed URLs (cached)
        all_metadata = generate_signed_urls_for_resized_test_set()

        if not all_metadata:
            return jsonify({'success': False, 'error': "No images/masks found."}), 400

        # Paginate results
        start = (page - 1) * page_size
        end = start + page_size
        paginated_metadata = all_metadata[start:end]

        return jsonify({'count': len(paginated_metadata),
                        'next': end < len(all_metadata),
                        'results': paginated_metadata}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


