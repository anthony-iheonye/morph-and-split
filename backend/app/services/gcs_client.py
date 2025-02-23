import os
import subprocess
from datetime import timedelta
from typing import Union

from google.api_core.exceptions import NotFound, GoogleAPIError
from google.cloud import storage
from google.cloud.exceptions import NotFound
from google.oauth2 import service_account

from app.config import google_cloud_config
from app.utils import current_directory
from app.utils.directory_file_management import sort_filenames

# Path to the service account key
service_account_path = os.path.join(current_directory(), str(google_cloud_config.service_account_file_name))

# Load the service account credentials
credentials = service_account.Credentials.from_service_account_file(service_account_path)

# Initialize Google Cloud Storage client with service account.
storage_client = storage.Client(credentials=credentials)

# Get bucket
bucket = None


def create_google_cloud_storage_bucket(bucket_name: str,
                                       project: str = None,
                                       location: str = 'us-south1',
                                       storage_class='STANDARD',
                                       enable_uniform_bucket_level_access: bool = True,
                                       cors: list = None,
                                       directories: list = None
                                       ) -> Union[storage.Bucket, Exception, None]:
    """
    Create a new Google Cloud Storage (GCS) bucket.

    :param directories: List of directories (blob paths) that will be created in the bucket.
    :param cors: JSON containing the CORS headers
    :param bucket_name: The bucket name
    :param project: (str) The project under which the bucket is to be created. If not passed, uses the project set on the client.
    :param location: (str) Location where the bucket is stored
    :param storage_class: (str) The storage class. Can either be STANDARD (standard storage),
        `NEARLINE` (nearline storage), `COLDLINE` (coldline storage) or `ARCHIVE` (archive storage). View detailed description of each storage class visit: https://cloud.google.com/storage/docs/storage-classes#descriptions.
    :param enable_uniform_bucket_level_access:
    :return: The GCS bucket
    """
    global bucket
    try:

        # Check if bucket already exists
        try:
            bucket = storage_client.get_bucket(bucket_name)
            print(f"Bucket {bucket_name} already exists. Updating configuration...")
        except NotFound:
            print(f"Bucket {bucket_name} does not exist. Creating bucket...")
            # Instantiate a bucket object to be owned by the 'storage_client'.
            bucket = storage_client.bucket(bucket_name)
            bucket = storage_client.create_bucket(bucket, location=location, project=project)

            if directories:
                for directory in directories:
                    # Add a trailing '/' to signify a folder and create an empty blob
                    blob = bucket.blob(f"{directory}/")
                    blob.upload_from_string("")

        # Update the bucket's storage_class
        if bucket.storage_class != storage_class:
            bucket.storage_class = storage_class

        # Update uniform bucket-level access status
        current_access_setting = bucket.iam_configuration.uniform_bucket_level_access_enabled
        if current_access_setting != enable_uniform_bucket_level_access:
            bucket.iam_configuration.uniform_bucket_level_access_enabled = enable_uniform_bucket_level_access

        # Set the CORS
        bucket.cors = cors

        # Save changes to the bucket
        bucket.patch()
        print(f"bucket {bucket_name} is now configured.")

        return bucket

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def get_bucket():
    """Get the existing bucket."""
    global bucket

    if bucket is not None:
        return bucket

    try:
        bucket = storage_client.get_bucket(google_cloud_config.bucket_name)
        print(f"Refetched bucket {google_cloud_config.bucket_name} ...")
        return bucket
    except NotFound:
        print(f'Bucket {google_cloud_config.bucket_name} does not exist.')
        return None


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
    blob = get_bucket().blob(blob_name)
    return blob.generate_signed_url(version="v4",
                                    expiration=timedelta(minutes=expiration),
                                    method=method,
                                    content_type=content_type
    )


def delete_files_in_google_cloud_storage_bucket(bucket_name: str,
                                                project: str = None,
                                                location: str = 'us-south1',
                                                storage_class='STANDARD',
                                                enable_uniform_bucket_level_access: bool = True,
                                                cors: list = None,
                                                directories: list = None
                                                ) -> Union[storage.Bucket, Exception, None]:
    """
    Delete files in the Google Cloud Bucket folders.

    :param directories:
    :param cors:
    :param bucket_name: The bucket name
    :param project: (str) The project under which the bucket is to be created. If not passed, uses the project set on the client.
    :param location: (str) Location where the bucket is stored
    :param storage_class: (str) The storage class. Can either be STANDARD (standard storage),
        `NEARLINE` (nearline storage), `COLDLINE` (coldline storage) or `ARCHIVE` (archive storage).
        View detailed description of each storage class visit: https://cloud.google.com/storage/docs/storage-classes#descriptions.
    :param enable_uniform_bucket_level_access:
    :return: The GCS bucket
    """

    try:
        # Initialize the storage client
        storage_client = storage.Client()

        # Check if bucket already exists
        try:
            bucket = storage_client.get_bucket(bucket_name)
            print(f"Bucket {bucket_name} already exists. Updating configuration...")
        except NotFound:
            print(f"Bucket {bucket_name} does not exist. Creating bucket...")
            # Instantiate a bucket object to be owned by the 'storage_client'.
            bucket = storage_client.bucket(bucket_name)
            bucket = storage_client.create_bucket(bucket, location=location, project=project)

        if directories:
            for directory in directories:
                # Add a trailing '/' to signify a folder and create an empty blob
                blob = bucket.blob(f"{directory}/")
                blob.upload_from_string("")

        # Update the bucket's storage_class
        if bucket.storage_class != storage_class:
            bucket.storage_class = storage_class

        # Update uniform bucket-level access status
        current_access_setting = bucket.iam_configuration.uniform_bucket_level_access_enabled
        if current_access_setting != enable_uniform_bucket_level_access:
            bucket.iam_configuration.uniform_bucket_level_access_enabled = enable_uniform_bucket_level_access

        # Set the CORS
        bucket.cors = cors

        # Save changes to the bucket
        bucket.patch()
        print(f"bucket {bucket_name} is now configured.")

        return bucket

    except Exception as e:
        print(f"An error occurred: {e}")
        return None


def delete_and_recreate_directories_in_gcs_bucket(bucket_name: str, directories: list):
    """
    Deletes a directory (and all its contents) in a Google Cloud Storage bucket
    and recreates the directory.

    :param bucket_name: (str) The name of the GCS bucket.
    :param directories: (list) A list containing the directories to delete and recreate.
    :return: Success or Failure message
    """

    try:
        # Initialize the storage client
        # storage_client = storage.Client()

        # Get the bucket
        bucket = storage_client.get_bucket(bucket_name)

        for directory in directories:
            # List all blobs in the directory
            blobs = list(bucket.list_blobs(prefix=f"{directory}/"))

            if not blobs:
                raise FileNotFoundError(f"Directory '{directory}' does not exist in bucket {bucket_name}.")

            # Delete all blobs in the directory
            bucket.delete_blobs(blobs)
            print(f"Deleted all contents of directory '{directory}'.")

            # Recreate the directory by uploading an empty blob
            empty_blob = bucket.blob(f"{directory}/")
            empty_blob.upload_from_string("")
            print(f"Recreated empty directory '{directory}'.")


    except NotFound:
        print(f"Bucket '{bucket_name}' does not exist.")

    except Exception as e:
        print(f"An error occurred: {e}")
        raise


def delete_google_cloud_storage_bucket(bucket_name: str):
    """
    Deletes a new bucket in the US region with the STANDARD storage class.
    """

    try:
        # Initialize storage client
        storage_client = storage.Client()

        # Check if the bucket exists
        bucket = storage_client.lookup_bucket(bucket_name)

        if bucket is None:
            print(f"Bucket {bucket_name} does not exist.")
            return False

        # Delete the bucket
        # bucket.delete(force=True)

        gcloud_command = [
            "gcloud",
            "storage",
            "rm",
            f"gs://{bucket_name}",
            "--recursive"# Destination in GCS
        ]

        result = subprocess.run(gcloud_command, check=True, capture_output=True)

        print({result.stdout.decode('utf-8')})
        print(f"Successfully deleted bucket {bucket_name}.")
        return True

    except GoogleAPIError as e:
        print(f"An error occurred while deleting the bucket: {e}")
        return False


def bucket_exists(bucket_name: str) -> bool:
    """
    Checks if a Google Cloud Storage bucket exists.

    :param bucket_name: The name of the bucket to check.
    :return: True if the bucket exists, False otherwise.
    """
    try:
        # Initialize the Google Cloud Storage client
        storage_client = storage.Client()

        # Attempt to get the bucket
        bucket = storage_client.lookup_bucket(bucket_name)

        if bucket is not None:
            print(f"Bucket {bucket_name} exists.")
            return True
        else:
            print(f"Bucket {bucket_name} does not exist.")
            return False

    except Exception as e:
        # Handle other unexpected errors
        print(f"An error occurred: {e}")
        return False


def list_files_in_bucket_directory(bucket_name: str, directory_path:str) -> list:
    """
    List the names of specific files within a directory in a Google Cloud Storage bucket.

    :param bucket_name: (str) The bucket name
    :param directory_path: (str) Path to the directory whose files should be listed.
    :return: List of file names.
    """

    storage_client = storage.Client()

    # list all blobs (files) in teh specific directory
    blobs = storage_client.list_blobs(bucket_or_name=bucket_name,
                                      prefix=directory_path,
                                      delimiter='/')
    return sort_filenames([blob.name.split('/')[-1] for blob in blobs if not blob.name.endswith("/")])


def upload_file_to_gcs_bucket(bucket_name:str, source_file_name:str, destination_blob_name:str):
    """
    Uploads a file to blob within a Google Cloud Storage bucket.

    :param bucket_name: (str) The name of the GCS bucket.
    :param source_file_name: (str) Path to the file to be uploaded.
    :param destination_blob_name: Name of the blob object in the bucket.
    """

    # Instantiate bucket object linked to the client
    bucket = get_bucket()

    # Instantiate existing blob
    blob = bucket.blob(destination_blob_name)

    # upload file to blob
    blob.upload_from_filename(source_file_name)
    print(f"File {source_file_name} uploaded to {destination_blob_name}.")


def download_files_from_gcs_folder(bucket_name: str, source_folder_path: str, destination_folder_path: str, copy= True):
    """
    Copies or moves files/folder from a Google Cloud Storage bucket to a local directory

    :param copy: if 'copy' is False, the files are moved, instead of copied, to the destination folder.
    :param bucket_name: (str) The name of the GCS bucket.
    :param source_folder_path: (str) Path to the file/folder to be downloaded.
    :param destination_folder_path: (str) Path to the local directory.
    """
    try:
        download_mode = 'cp' if copy else 'mv'
        source_directory = source_folder_path[:-2] if source_folder_path.endswith("/") else source_folder_path
        gcloud_command = ["gcloud",
                          "storage",
                          download_mode,
                          f"gs://{bucket_name}/{source_directory}/*",
                          destination_folder_path
                          ]

        result = subprocess.run(gcloud_command, check=True, capture_output=True)

        print(f"File downloaded successfully!\n"
              f"{result.stdout.decode('utf-8')}\n")

    except subprocess.CalledProcessError as e:
        print("Error while copying file from Google Cloud Storage: ", e.stderr)
        return e.stderr


def upload_files_to_gcs_bucket(bucket_name: str, source_folder_path: str, destination_folder_path: str, copy=True):
    """
    Copies or moves files/folder from a local directory to a Google Cloud Storage bucket.

    :param bucket_name: (str) The name of the GCS bucket.
    :param source_folder_path: (str) Path to the local file/folder to be uploaded.
    :param destination_folder_path: (str) Path to the destination directory in GCS.
    :param copy: if 'copy' is False, the files are moved instead of copied to GCS.
    """
    try:
        upload_mode = 'cp' if copy else 'mv'  # Choose between copy or move
        source_directory = source_folder_path.rstrip("/") + "/*"  # Ensure no trailing slash
        destination_directory = destination_folder_path.rstrip("/")  # Ensure no trailing slash

        gcloud_command = [
            "gcloud",
            "storage",
            upload_mode,
            source_directory,  # Local source folder
            f"gs://{bucket_name}/{destination_directory}/",  # Destination in GCS
        ]

        result = subprocess.run(gcloud_command, check=True, capture_output=True)

        print(f"File uploaded successfully!\n{result.stdout.decode('utf-8')}\n")

    except subprocess.CalledProcessError as e:
        print("Error while uploading file to Google Cloud Storage:", e.stderr.decode('utf-8'))
        return e.stderr.decode('utf-8')
