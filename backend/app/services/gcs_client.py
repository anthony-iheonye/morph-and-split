import os
from datetime import timedelta

from google.oauth2 import service_account
from google.cloud import storage
from app.config import google_cloud_config

from app.utils import current_directory

# Path to the service account key
service_account_path = os.path.join(current_directory(), str(google_cloud_config.service_account_file_name))

# Load the service account credentials
credentials = service_account.Credentials.from_service_account_file(service_account_path)

# Initialize Google Cloud Storage client with service account.
storage_client = storage.Client(credentials=credentials)

# Get bucket
bucket = storage_client.get_bucket(google_cloud_config.bucket_name)


def generate_signed_url(blob_name: str,
                        method: str ='GET',
                        expiration: int =60,
                        content_type: str=None):
    """
    Generate a signed URL for a GCS blob.

    :param blob_name: The name of the blob.
    :param method: The HTTP method to use (e.g. 'PUT', 'GET').
    :param expiration: The expiration of the URL in minutes.
    :param content_type: The content type of the URL, (e.g. 'application/octet-stream').
    """
    blob = bucket.blob(blob_name)
    return blob.generate_signed_url(version="v4",
                                    expiration=timedelta(minutes=expiration),
                                    method=method,
                                    content_type=content_type
    )
