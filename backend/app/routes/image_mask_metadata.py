from flask import Blueprint, jsonify, send_from_directory, url_for

from app.utils import directory_store, get_sorted_filenames

# Blueprint definition
image_mask_metadata = Blueprint('image_mask_metadata', __name__)

# directory definition
IMAGE_DIR = directory_store.resized_image_dir
MASK_DIR = directory_store.resized_mask_dir


# Route to serve image files
@image_mask_metadata.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory(IMAGE_DIR, filename)


# Route to serve mask files
@image_mask_metadata.route('/masks/<filename>')
def serve_mask(filename):
    return send_from_directory(MASK_DIR, filename)


@image_mask_metadata.route('/metadata/image_mask', methods=['GET'])
def get_image_mask_metadata():
    try:
        # Get sorted filenames for images and masks
        image_files = get_sorted_filenames(IMAGE_DIR)
        mask_files = get_sorted_filenames(MASK_DIR)

        # Ensure the number of images and mask align
        if len(image_files) != len(mask_files):
            return jsonify({'error': "Mismatch between number of images and masks."}), 400

        metadata = []
        for image_name, mask_name in zip(image_files, mask_files):
            image_path = url_for('image_mask_metadata.serve_image', filename=image_name, _external=True)
            mask_path = url_for('image_mask_metadata.serve_mask', filename=mask_name, _external=True)

            metadata.append({'image': {'name': image_name, 'url': image_path},
                             'mask': {'name': mask_name, 'url': mask_path}
                             })

        return jsonify({'count': len(metadata), 'results': metadata}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500