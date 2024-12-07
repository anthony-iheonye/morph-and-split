from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename, send_file
import os
from app.utils import directory_store

file_download = Blueprint('file_download', __name__)
AUGMENTED_DIR = directory_store.augmented



@file_download.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    filename = secure_filename(filename)

    # check if file exist in the directory
    if os.path.exists(os.path.join(AUGMENTED_DIR, filename)):
        try:
            return send_from_directory(AUGMENTED_DIR, filename, as_attachment=True)
        except Exception as e:
            print(f"Error will sending file: {e}")
            return jsonify({'success': False, 'error': 'Error while sending file.'}), 500
    else:
        # File not found
        return jsonify({'error': 'File not found'}), 404

