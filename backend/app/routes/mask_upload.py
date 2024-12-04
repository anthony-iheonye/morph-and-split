from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from app.utils import directory_store

mask_upload = Blueprint('mask_upload', __name__)
MASK_DIR = directory_store.mask_dir

@mask_upload.route('/upload/masks', methods=['POST'])
def upload_masks():
    masks = request.files.getlist('masks')

    if not masks:
        return jsonify({'message': 'No mask uploaded'}), 400

    for mask in masks:
        print(mask.filename)
        filename = secure_filename(mask.filename)
        filepath = os.path.join(MASK_DIR, filename)
        mask.save(filepath)

    return jsonify({'message': 'Masks uploaded successfully.'}), 200
