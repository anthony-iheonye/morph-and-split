from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from app.utils import directory_store

image_upload = Blueprint('image_upload', __name__)
IMAGE_DIR = directory_store.image_dir

@image_upload.route('/upload/images', methods=['POST'])
def upload_images():
    images = request.files.getlist('images')

    if not images:
        return jsonify({'message': 'No images uploaded'}), 400

    for img in images:
        print(img.filename)
        filename = secure_filename(img.filename)
        filepath = os.path.join(IMAGE_DIR, filename)
        img.save(filepath)

    return jsonify({'message': 'Images uploaded successfully.'}), 200
