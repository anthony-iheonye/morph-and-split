from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename, send_file
import os
from app.utils import directory_store

file_download = Blueprint('file_download', __name__)
AUGMENTED_DIR = directory_store.augmented



@file_download.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    zip_path = os.path.join(AUGMENTED_DIR, secure_filename(filename))
    print(f"zip path: {zip_path} ")
    if os.path.exists(zip_path):
        return send_file(zip_path, as_attachment=True,)
    else:
        return jsonify({"error": "File not found"}), 404

