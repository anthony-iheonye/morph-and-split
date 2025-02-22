import os

from google.oauth2 import service_account
from google.cloud import storage
from app.config import google_cloud_config

from app.utils import current_directory

# Path to the service account key
service_account_path = os.path.join(current_directory(), 'morph-and-split-key.json')

# Load the service account credentials
credentials = service_account.Credentials.from_service_account_file(service_account_path)

# Initialize Google Cloud Storage client with service account.
storage_client = storage.Client(credentials=credentials)

# Get bucket
bucket = storage_client.bucket(google_cloud_config.bucket_name)

