import os
from flask import Blueprint, jsonify
from app.utils import directory_store, get_sorted_filenames


uploaded_mask_names = Blueprint('uploaded_mask_names', __name__)
MASK_DIR = directory_store.mask_dir

@uploaded_mask_names.route('/upload/mask_names', methods=['GET'])
def get_uploaded_image_names():
    try:
        mask_files = get_sorted_filenames(MASK_DIR)
        return jsonify({'count': len(mask_files), 'results': mask_files})
    except Exception as e:
        return jsonify({'error': str(e)})
