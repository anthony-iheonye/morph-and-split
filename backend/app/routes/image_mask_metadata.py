import os

from flask import Blueprint, jsonify, send_from_directory, url_for, request

from app.utils import directory_store, get_sorted_filenames

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
    # if os.getenv("K_SERVICE"):  # This environment variable exists in Cloud Run
    #     return "https"
    return "https"


@image_mask_metadata.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory(IMAGE_DIR, filename, mimetype='image/*')


@image_mask_metadata.route('/train_images/<filename>')
def serve_train_image(filename):
    return send_from_directory(RESIZED_TRAIN_IMAGE_DIR, filename, mimetype='image/*')


@image_mask_metadata.route('/val_images/<filename>')
def serve_val_image(filename):
    return send_from_directory(RESIZED_VAL_IMAGE_DIR, filename, mimetype='image/*')


@image_mask_metadata.route('/test_images/<filename>')
def serve_test_image(filename):
    return send_from_directory(RESIZED_TEST_IMAGE_DIR, filename, mimetype='image/*')


# Route to serve mask files
@image_mask_metadata.route('/masks/<filename>')
def serve_mask(filename):
    return send_from_directory(MASK_DIR, filename, mimetype='image/*')


@image_mask_metadata.route('/train_masks/<filename>')
def serve_train_mask(filename):
    return send_from_directory(RESIZED_TRAIN_MASK_DIR, filename, mimetype='image/*')


@image_mask_metadata.route('/val_masks/<filename>')
def serve_val_mask(filename):
    return send_from_directory(RESIZED_VAL_MASK_DIR, filename, mimetype='image/*')


@image_mask_metadata.route('/test_masks/<filename>')
def serve_test_mask(filename):
    return send_from_directory(RESIZED_TEST_MASK_DIR, filename, mimetype='image/*')


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
