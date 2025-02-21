
import os
from datetime import timedelta

from flask import Blueprint, request, jsonify
from google.cloud import storage
from google.oauth2 import service_account

from app.config import google_cloud_config
from app.utils import current_directory

signed_upload_urls = Blueprint('signed_upload_urls', __name__)
service_account_path = os.path.join(current_directory(), 'morph-and-split-key.json')

@signed_upload_urls.route('/generate-signed-upload-url', methods=['POST'])
def generate_signed_upload_urls():
    """
    Generates a v4 signed URL for uploading data files to Google Cloud Storage, using HTTP PUT request.
    """
    try:
        data = request.json
        filenames = data.get('filenames', [])
        content_types = data.get('content_types', [])
        folder_path = data.get('folder_path', '')
        signed_urls = []

        # Load the service account credentials
        credentials = service_account.Credentials.from_service_account_file(service_account_path)

        # Initialize Google Cloud Storage client with service account.
        client = storage.Client(credentials=credentials)
        bucket = client.bucket(google_cloud_config.bucket_name)

        for i, filename in enumerate(filenames):
            blob = bucket.blob(f"{folder_path}/{filename}")

            # Use corresponding type if provided; default to application/octet-stream
            content_type = content_types[i] if i < len(content_types) else 'application/octet-stream'

            # generate signed URL for upload with specific content type
            url = blob.generate_signed_url(
                version="v4",
                expiration=timedelta(minutes=60),
                # Allow PUT request using this URL
                method="PUT",
                content_type=content_type,
            )
            signed_urls.append({"filename": filename, "url": url, "content_type": content_type})

        return jsonify({'success': True,
                        'count': len(signed_urls),
                        'results': signed_urls}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
