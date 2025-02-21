
import os
from datetime import timedelta

from flask import Blueprint, jsonify, request
from google.cloud import storage
from google.oauth2 import service_account

from app.config import google_cloud_config
from app.utils import current_directory
from werkzeug.utils import secure_filename, send_file


signed_download_urls = Blueprint('signed_download_urls', __name__)

service_account_path = os.path.join(current_directory(), 'morph-and-split-key.json')


@signed_download_urls.route('/generate-signed-download-url', methods=['GET'])
def generate_signed_download_urls():
    """
    Generates a v4 signed URL for downloading the zipped augmented result, from Google Cloud Storage, using HTTP GET request.
    """
    try:
        filenames = request.args.getlist('filenames')

        if not filenames:
            return jsonify({'success': False, 'error': "Filename parameter is required"}), 400

        # Load the service account credentials
        credentials = service_account.Credentials.from_service_account_file(service_account_path)

        # Initialize Google Cloud Storage client with service account.
        storage_client = storage.Client(credentials=credentials)
        bucket = storage_client.bucket(google_cloud_config.bucket_name)

        signed_urls = []
        for filename in filenames:
            secure_file = secure_filename(filename)
            blob = bucket.get_blob(f"{google_cloud_config.augmented_dir}/{secure_file}")

            # generate signed URL for upload with specific content type
            url = blob.generate_signed_url(
                version="v4",
                expiration=timedelta(minutes=60),
                # Allow GET request using this URL
                method="GET",
            )
            signed_urls.append({"filename": filename, "url": url})

        return jsonify({'success': True,
                        'count': len(signed_urls),
                        'results': signed_urls}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
