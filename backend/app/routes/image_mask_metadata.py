from flask import Blueprint, jsonify

from app.utils import directory_store, get_sorted_filepaths

image_mask_metadata = Blueprint('image_mask_metadata', __name__)
IMAGE_DIR = directory_store.image_dir
MASK_DIR = directory_store.mask_dir

@image_mask_metadata.route('/metadata/image_mask', methods=['GET'])
def get_image_mask_metadata():
    try:
        metadata = []

        for image_name, mask_name in zip([get_sorted_filepaths(IMAGE_DIR),
                                          get_sorted_filepaths(MASK_DIR)]):
            metadata.append({'imageName': image_name,
                             'maskName': mask_name,
                             'imageUrl': f"{IMAGE_DIR}/{image_name}",
                             'maskUrl': f"{MASK_DIR}/{mask_name}"
                             })

        return jsonify(metadata), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500