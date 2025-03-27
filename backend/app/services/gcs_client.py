import json
import logging
import os
import subprocess
from datetime import timedelta
from typing import Union, Optional, List

from google.api_core.exceptions import NotFound, GoogleAPIError
from google.auth import default
from google.auth import impersonated_credentials
from google.auth.credentials import Credentials
from google.cloud import storage
from google.cloud.exceptions import NotFound
from google.oauth2 import service_account

from app.config.google_cloud_storage import GoogleCloudStorageConfig
from app.services.session_store import session_store
from app.utils.directory_file_management import sort_filenames

logger = logging.getLogger(__name__)

GCS_KEY_CONTENT = os.getenv("GCS_SIGNED_URL_KEY")

if GCS_KEY_CONTENT:
    credentials_info = json.loads(GCS_KEY_CONTENT)
    bucket_credentials_for_signed_urls = service_account.Credentials.from_service_account_info(credentials_info)
else:
    gc_config = session_store.gcs_config
    bucket_credentials_for_signed_urls = service_account.Credentials.from_service_account_file(
        gc_config.service_account_file_path)


def create_google_cloud_storage_bucket(bucket_name: Optional[str],
                                       google_cloud_config: Optional[GoogleCloudStorageConfig],
                                       ) -> Union[storage.Bucket, None]:
    """
    Creates a new Google Cloud Storage bucket or updates the configuration of an existing one.

    This function applies configuration settings such as location, storage class,
    uniform bucket-level access, and CORS.

    :param bucket_name: The name of the GCS bucket.
    :param google_cloud_config: Configuration object for the bucket.
    :return: The configured GCS bucket object or None if creation/update fails.
    """

    try:

        location = google_cloud_config.location
        storage_class = google_cloud_config.storage_class
        enable_uniform_bucket_level_access = google_cloud_config.enable_uniform_bucket_level_access or False

        cors = google_cloud_config.cors

        # Prepare credentials if provided; otherwise use default credentials.
        credentials, project = default()

        if isinstance(credentials, Credentials):
            credentials = impersonated_credentials.Credentials(
                source_credentials=credentials,
                target_principal="morph-and-split-tool-sa@morph-and-split-tool.iam.gserviceaccount.com",
                target_scopes=["https://www.googleapis.com/auth/cloud-platform"],
                lifetime=3600
            )

        storage_client = storage.Client(credentials=credentials, project=project)

        # Check if bucket exist
        bucket = storage_client.lookup_bucket(bucket_name)

        if bucket:
            logger.info(f"Bucket '{bucket_name}' already exists. Updating configuration...")
        else:
            logger.info(f"Bucket '{bucket_name}' does not exist. Creating bucket...")
            # Instantiate a bucket object to be owned by the 'storage_client'.
            bucket = storage_client.bucket(bucket_name)
            bucket = storage_client.create_bucket(bucket_or_name=bucket,
                                                  location=location,
                                                  project=project,
                                                  )
            logger.info(f"Bucket '{bucket_name}' created successfully.")

        # Update the bucket's storage_class
        if bucket.storage_class != storage_class:
            bucket.storage_class = storage_class
            logging.info(f"Updated storage class to '{storage_class}'.")

        # Update uniform bucket-level access status
        current_access_setting = bucket.iam_configuration.uniform_bucket_level_access_enabled
        if current_access_setting != enable_uniform_bucket_level_access:
            bucket.iam_configuration.uniform_bucket_level_access_enabled = enable_uniform_bucket_level_access
            logger.info(f"Updated uniform bucket-level access to '{enable_uniform_bucket_level_access}'.")

        # Update CORS configuration if provided
        if cors is not None:
            bucket.cors = cors
            logger.info(f"Updated cors configuration to '{cors}'.")


        # Save changes to the bucket
        bucket.patch()
        logger.info(f"bucket '{bucket_name}' is now configured successfully.")

        return bucket

    except Exception as e:
        logger.exception(f"An error occurred while creating/updating bucket '{bucket_name}': {e}")
        return None


def create_folders_in_bucket(session_id: str, directories: List[str]):
    """
        Creates empty directory blobs in a GCS bucket for simulating folder structure.

        :param session_id: Session identifier to retrieve the associated bucket.
        :param directories: List of folder paths to create inside the bucket.
        :return: True if directories were created successfully, False otherwise.
    """
    bucket_name = session_store.get_bucket_name(session_id=session_id)

    try:
        # bucket = get_bucket(google_cloud_config=google_cloud_config)
        bucket = session_store.get_bucket(session_id=session_id)

        if bucket is None:
            logger.error(f"Bucket '{bucket_name}' does not exist. Cannot create directories.")
            print(f"Bucket '{bucket_name}' does not exist. Cannot create directories.")
            return False

        for directory in directories:
            blob = bucket.blob(f"{directory}/")
            blob.upload_from_string("")
            logger.info(f"Created directory '{directory}/' in bucket '{bucket_name}'.")

        return True

    except Exception as e:
        logger.exception(f"Error creating directories in bucket '{bucket_name}': {e}")
        return False


def get_bucket(session_id: str) -> Union[storage.Bucket, None]:
    """
    Retrieves the GCS bucket for the given session ID from the session store.

    :param session_id: The session identifier.
    :return: Cached bucket object or None if not found.
    """

    bucket_name = session_store.get_bucket_name(session_id=session_id)

    try:
        cached_bucket = session_store.get_bucket(session_id=session_id)

        # Return the cached bucket if already retrieved.
        if cached_bucket is not None:
            print(f"Returning cached bucket '{cached_bucket.name}'.")
            return cached_bucket
        else:
            return None


    except Exception as e:
        logger.exception(f"An error occurred while retrieving bucket '{bucket_name}': {e}")
        return None


def get_bucket_for_signed_url(session_id: str) -> Union[storage.Bucket, None]:
    """
        Retrieves and configures the GCS bucket used for generating signed URLs.

        If configuration values (like storage class or CORS) differ from expected,
        they will be updated and persisted.

        :param session_id: The session identifier.
        :return: The bucket object or None if retrieval fails.
    """

    signed_url_bucket = session_store.get_signed_url_bucket(session_id)

    if signed_url_bucket is not None:
        return signed_url_bucket

    bucket_name = session_store.get_bucket_name(session_id)

    try:
        google_cloud_config = session_store.gcs_config
        # Use Google Cloud configuration defaults if provided and parameters are not set.
        project = google_cloud_config.project_name
        storage_class = google_cloud_config.storage_class

        enable_uniform_bucket_level_access = google_cloud_config.enable_uniform_bucket_level_access or False
        cors = google_cloud_config.cors

        # Initialize the storage client.
        storage_client = storage.Client(credentials=bucket_credentials_for_signed_urls,
                                        project=project)

        # Check if bucket exist using lookup_bucket
        bucket = storage_client.lookup_bucket(bucket_name)

        if not bucket:
            print(f"Bucket '{bucket_name}' does not exist.")
            return None

        # Update configuration if needed.
        needs_update = False

        # Check and Update the bucket's storage_class
        if bucket.storage_class != storage_class:
            bucket.storage_class = storage_class
            logging.info(f"Updated storage class to '{storage_class}'.")
            needs_update = True

        # Update uniform bucket-level access status
        current_access_setting = bucket.iam_configuration.uniform_bucket_level_access_enabled
        if current_access_setting != enable_uniform_bucket_level_access:
            bucket.iam_configuration.uniform_bucket_level_access_enabled = enable_uniform_bucket_level_access
            logger.info(f"Updated uniform bucket-level access to '{enable_uniform_bucket_level_access}'.")
            needs_update = True

        # Update CORS configuration if provided
        if cors is not None:
            if bucket.cors != cors:
                bucket.cors = cors
                logger.info(f"Updated cors configuration to '{cors}'.")
                needs_update = True


        # Save changes to the bucket
        if needs_update:
            bucket.patch()
            logger.info(f"bucket '{bucket_name}' is now configured successfully.")
        else:
            logger.info(f"No configuration changes needed for bucket '{bucket_name}'.")

        # Cache the bucket for future calls.
        session_store.set_signed_url_bucket(session_id, bucket)

        return bucket

    except Exception as e:
        logger.exception(f"An error occurred while retrieving bucket '{bucket_name}': {e}")
        return None


def generate_signed_url(session_id: str,
                        blob_name: str,
                        method: str ='GET',
                        expiration: int =720,
                        content_type: Optional[str]=None,
                        ):
    """
    Generates a signed URL for accessing a GCS blob using a specified method.

    :param session_id: Session ID to identify the bucket.
    :param blob_name: Name of the GCS blob.
    :param method: HTTP method allowed for the signed URL (e.g., GET, PUT).
    :param expiration: Time in minutes until the URL expires.
    :param content_type: MIME type of the blob (optional).
    :return: A signed URL string.
    """
    bucket = get_bucket_for_signed_url(session_id=session_id)
    blob = bucket.blob(blob_name)

    return blob.generate_signed_url(version="v4",
                                    expiration=timedelta(minutes=expiration),
                                    method=method,
                                    content_type=content_type,
                                    service_account_email="morph-and-split-tool-sa@morph-and-split-tool.iam.gserviceaccount.com"
                                    )


def delete_google_cloud_storage_bucket(session_id: str):
    """
    Deletes a GCS bucket associated with a given session ID using the gcloud CLI.

    :param session_id: The session identifier.
    :return: True if deletion succeeds, False otherwise.
    """
    bucket_name = session_store.get_bucket_name(session_id=session_id)

    try:
        credentials, project = default()
        storage_client = storage.Client(project=project,
                                        credentials=credentials)

        # Check if the bucket exists
        bucket = storage_client.lookup_bucket(bucket_name)

        if bucket is None:
            logger.info(f"Bucket {bucket_name} does not exist.")
            return False

        gcloud_command = [
            "gcloud",
            "storage",
            "rm",
            f"gs://{bucket_name}",
            "--recursive"# Destination in GCS
        ]

        result = subprocess.run(gcloud_command, check=True, capture_output=True)

        print({result.stdout.decode('utf-8')})
        logging.info(f"Successfully deleted bucket {bucket_name}.")

        return True

    except GoogleAPIError as e:
        print(f"An error occurred while deleting the bucket: {e}")
        return False


def delete_and_recreate_directories_in_gcs_bucket(session_id: str,
                                                  directories: list):
    """
    Deletes specified folders and their contents in a GCS bucket,
    then recreates them as empty directories.

    :param session_id: The session identifier.
    :param directories: List of directories to delete and recreate.
    :return: None
    """
    bucket_name = session_store.get_bucket_name(session_id=session_id)
    try:
        # Use Google Cloud configuration defaults if provided and parameters are not set.

        # Get the bucket
        bucket = get_bucket(session_id=session_id)

        for directory in directories:
            # List all blobs in the directory
            blobs = list(bucket.list_blobs(prefix=f"{directory}/"))

            if not blobs:
                raise FileNotFoundError(f"Directory '{directory}' does not exist in bucket {bucket_name}.")

            # Delete all blobs in the directory
            bucket.delete_blobs(blobs)
            logging.info(f"Deleted all contents of directory '{directory}'.")

            # Recreate the directory by uploading an empty blob
            empty_blob = bucket.blob(f"{directory}/")
            empty_blob.upload_from_string("")
            logging.info(f"Recreated empty directory '{directory}'.")

    except NotFound:
        logging.info(f"Bucket '{bucket_name}' does not exist.")

    except Exception as e:
        logger.info(f"An error occurred: {e}")
        raise


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


def list_files_in_bucket_directory(session_id: str,
                                   directory_path:str) -> list:
    """
        Lists files within a specific directory in a GCS bucket.

        :param session_id: The session identifier.
        :param directory_path: GCS directory path whose contents to list.
        :return: Sorted list of file names in the directory.
    """

    credentials, project_name = default()

    bucket_name = session_store.get_bucket_name(session_id=session_id)
    storage_client = storage.Client(project=project_name, credentials=credentials)

    # list all blobs (files) in teh specific directory
    blobs = storage_client.list_blobs(bucket_or_name=bucket_name,
                                      prefix=directory_path,
                                      delimiter='/')

    return sort_filenames([blob.name.split('/')[-1] for blob in blobs if not blob.name.endswith("/")])


def upload_file_to_gcs_bucket(session_id: str,
                              source_file_name:str,
                              destination_blob_name:str):
    """
    Uploads a single file to a GCS bucket.

    :param session_id: The session identifier.
    :param source_file_name: Local path to the source file.
    :param destination_blob_name: Name of the destination blob in GCS.
    :return: None
    """

    # Instantiate bucket object linked to the client
    bucket = get_bucket(session_id=session_id)

    # Instantiate existing blob
    blob = bucket.blob(destination_blob_name)

    # upload file to blob
    blob.upload_from_filename(source_file_name)
    logging.info(f"File {source_file_name} uploaded to {destination_blob_name}.")


def upload_files_to_gcs_bucket(bucket_name: str,
                               source_folder_path: str,
                               destination_folder_path: str,
                               copy=True):
    """
    Uploads or moves multiple files from a local folder to a GCS bucket using gcloud CLI.

    :param bucket_name: GCS bucket name.
    :param source_folder_path: Local source directory.
    :param destination_folder_path: Target folder in GCS.
    :param copy: If True, files are copied. If False, files are moved.
    :return: Output or error message.
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


def download_files_from_gcs_folder(bucket_name: str,
                                   source_folder_path: str,
                                   destination_folder_path: str,
                                   copy= True):
    """
    Downloads or moves files from a GCS bucket to a local directory.

    :param bucket_name: GCS bucket name.
    :param source_folder_path: Source path in the GCS bucket.
    :param destination_folder_path: Local path to download the files.
    :param copy: If True, files are copied. If False, files are moved.
    :return: Tuple (bool, message) indicating success and message.
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

        logger.info(f"File(s) downloaded successfully from GCS:\n{result.stdout}")
        return True, f"File downloaded successfully to {destination_folder_path}."

    except subprocess.CalledProcessError as e:
        error_msg = e.stderr.decode("utf-8") if e.stderr else "Unknown error"
        logger.error(f"Error while copying file from Google Cloud Storage: {error_msg}")
        return False, error_msg


