from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename, send_file
import os
from app.services import session_store

download_file = Blueprint('file_download', __name__)


@download_file.route('/download/augmentation_results/<filename>', methods=['GET'])
def download_augmentation_result(filename):
    """
    Endpoint to download an augmented file for a given session.

    The function retrieves the session ID from the query parameters,
    secures the requested filename, checks for its existence in the
    augmented directory associated with the session, and returns it
    as a downloadable file.

    URL params:
        filename (str): Name of the file to download.

    Query params:
        sessionId (str): Session identifier used to locate the correct directory.

    Returns:
        Flask Response: The file as an attachment, or a JSON error response.
    """

    session_id = request.args.get('sessionId')
    augmented_dir = session_store.get_directory_store(session_id).augmented

    filename = secure_filename(filename)

    # check if file exist in the directory
    if os.path.exists(os.path.join(augmented_dir, filename)):
        try:
            return send_from_directory(augmented_dir, filename, as_attachment=True)
        except Exception as e:
            print(f"Error while sending file: {e}")
            return jsonify({'success': False, 'error': 'Error while sending file.'}), 500
    else:
        # File not found
        return jsonify({'error': 'File not found'}), 404

