import os
from flask import Blueprint, jsonify
from app.utils import directory_store, get_sorted_filenames


uploaded_image_names = Blueprint('uploaded_image_names', __name__)
IMAGE_DIR = directory_store.image_dir

@uploaded_image_names.route('/upload/image_names', methods=['GET'])
def get_uploaded_image_names():
    try:
        image_files = get_sorted_filenames(IMAGE_DIR)
        return jsonify({'success': True, 'count': len(image_files), 'results': image_files })
    except Exception as e:
        return jsonify({'error': str(e)})
