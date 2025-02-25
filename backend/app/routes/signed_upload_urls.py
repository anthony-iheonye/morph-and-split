from flask import Blueprint, request, jsonify

from app.config import google_cloud_config
from app.services import generate_signed_url

signed_upload_urls = Blueprint('signed_upload_urls', __name__)


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

        for i, filename in enumerate(filenames):
            # Use corresponding type if provided; default to application/octet-stream
            content_type = content_types[i] if i < len(content_types) else 'application/octet-stream'

            url = generate_signed_url(blob_name=f"{folder_path}/{filename}",
                                      method="PUT",
                                      content_type=content_type,
                                      google_cloud_config=google_cloud_config)

            signed_urls.append({"filename": filename, "url": url, "content_type": content_type})

        return jsonify({'success': True,
                        'count': len(signed_urls),
                        'results': signed_urls}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
