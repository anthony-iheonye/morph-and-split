import logging
import subprocess
from datetime import timedelta
from typing import Union, Optional, List
import time

from google.api_core.exceptions import NotFound, GoogleAPIError
from google.cloud import storage
from google.cloud.exceptions import NotFound
from google.oauth2 import service_account
from google.auth import default
from google.auth.credentials import Credentials

from app.config import google_cloud_config as gc_config
from app.config.google_cloud_storage import GoogleCloudStorageConfig
from app.utils.directory_file_management import sort_filenames

from google.auth import impersonated_credentials
import os
import json

logger = logging.getLogger(__name__)

# Global bucket variable
GLOBAL_BUCKET: Optional[storage.Bucket] = None
GLOBAL_BUCKET_FOR_SIGNED_URLS: Optional[storage.Bucket] = None

GCS_KEY_CONTENT = os.getenv("GCS_SIGNED_URL_KEY")

if GCS_KEY_CONTENT:
    credentials_info = json.loads(GCS_KEY_CONTENT)
    bucket_credentials_for_signed_urls = service_account.Credentials.from_service_account_info(credentials_info)
else:
    bucket_credentials_for_signed_urls = service_account.Credentials.from_service_account_file(
        gc_config.service_account_file_path)


def create_google_cloud_storage_bucket(bucket_name: Optional[str] = None,
                                       project: Optional[str] = None,
                                       location: Optional[str] = None,
                                       storage_class: Optional[str] = None,
                                       enable_uniform_bucket_level_access: bool = True,
                                       service_account_file_path: Optional[str] =None,
                                       cors: Optional[list[dict]] = None,
                                       directories: Optional[list[str]] = None,
                                       google_cloud_config: Optional[GoogleCloudStorageConfig] = None,
                                       ) -> Union[storage.Bucket, None]:
    """
    Create or update a Google Cloud Storage (GCS) bucket with the given configuration.

    If the bucket exists, its configuration is updated; if not, a new bucket is created.
    Optionally creates empty blobs representing directories in the bucket.

    :param google_cloud_config:
    :param bucket_name: The bucket name.
    :param project: The project under which the bucket is to be created.
    :param location: Location where the bucket is stored.
    :param storage_class: The storage class, e.g., STANDARD, NEARLINE, COLDLINE, or ARCHIVE.
    :param enable_uniform_bucket_level_access: Whether to enable uniform bucket-level access.
    :param service_account_file_path: Path to the service account JSON key file.
    :param cors: List of dictionaries containing CORS configuration.
    :param directories: List of directory paths to create in the bucket.
    :return: The configured GCS bucket or None if an error occurs.
    """
    global GLOBAL_BUCKET

    try:
        # Use Google Cloud configuration defaults if provided and parameters are not set.
        if google_cloud_config:
            bucket_name = bucket_name or google_cloud_config.bucket_name
            project = project or google_cloud_config.project_name
            location = location or google_cloud_config.location
            storage_class = storage_class or google_cloud_config.storage_class

            enable_uniform_bucket_level_access = (enable_uniform_bucket_level_access or
                                                  google_cloud_config.enable_uniform_bucket_level_access or False)

            service_account_file_path = service_account_file_path or google_cloud_config.service_account_file_path

            cors = cors or google_cloud_config.cors
            directories = directories or []

        # Prepare credentials if provided; otherwise use default credentials.
        credentials, project = default()

        # if service_account_file_path:
        #     credentials = service_account.Credentials.from_service_account_file(service_account_file_path)
        #     logger.info('Using provided service account credentials.')
        # else:
        #     credentials = None
        #     logger.info('Using default credentials.')

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
                                                  # timeout=120
                                                  )
            logger.info(f"Bucket '{bucket_name}' created successfully.")

            # # Create some lag for bucket to be created before creating directories in the bucket.
            # retries = 5
            # for _ in range(retries):
            #     if storage_client.lookup_bucket(google_cloud_config.bucket_name):
            #         break
            #     time.sleep(5)
            #
            # # Create directories if provided
            # if directories:
            #     for directory in directories:
            #         # Append a trailing '/' to signify a folder and create an empty blob
            #         blob = bucket.blob(f"{directory}/")
            #         blob.upload_from_string("")
            #         logger.info(f"Created directory '{directory}'/ in bucket '{bucket_name}'")

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

        GLOBAL_BUCKET = bucket
        return bucket

    except Exception as e:
        logger.exception(f"An error occurred while creating/updating bucket '{bucket_name}': {e}")
        return None


def create_folders_in_bucket(directories: List[str], google_cloud_config: Optional[GoogleCloudStorageConfig]):
    """
    Create empty directories blobs in the given Google Cloud Storage bucket.
    :param directories: List of directory paths to create in the bucket.
    :param google_cloud_config: Google Cloud Storage configuration object.
    :return: True if successful, False otherwise.
    """

    try:
        bucket = get_bucket(google_cloud_config=google_cloud_config)

        if bucket is None:
            logger.error(f"Bucket '{google_cloud_config.bucket_name}' does not exist. Cannot create directories.")
            print(f"Bucket '{google_cloud_config.bucket_name}' does not exist. Cannot create directories.")
            return False

        for directory in directories:
            blob = bucket.blob(f"{directory}/")
            blob.upload_from_string("")
            logger.info(f"Created directory '{directory}/' in bucket '{google_cloud_config.bucket_name}'.")

        return True

    except Exception as e:
        logger.exception(f"Error creating directories in bucket '{google_cloud_config.bucket_name}': {e}")
        return False


def get_bucket(bucket_name: Optional[str] = None,
               project: Optional[str] = None,
               location: Optional[str] = None,
               storage_class: Optional[str] = None,
               enable_uniform_bucket_level_access: bool = True,
               service_account_file_path: Optional[str] = None,
               cors: Optional[list[dict]] = None,
               google_cloud_config: Optional[GoogleCloudStorageConfig] = None,
               ) -> Union[storage.Bucket, None]:
    """
        Retrieves a Google Cloud Storage (GCS) bucket with the given configuration.
        If the bucket exists, its configuration is updated if needed.

        Defaults for bucket name, project, location, storage class, uniform access,
        service account file, and CORS configuration are taken from google_cloud_config
        if provided.

        :param bucket_name: The bucket name (default from config if not provided).
        :param project: The GCP project (default from config if not provided).
        :param location: The bucket location (default from config if not provided).
        :param storage_class: The desired storage class (default from config if not provided).
        :param enable_uniform_bucket_level_access: Whether to enable uniform bucket-level access.
        :param service_account_file_path: Path to the service account key file.
               (default from config if not provided).
        :param cors: List of CORS configurations (default from config if not provided).
        :param google_cloud_config: A GoogleCloudStorageConfig instance for defaults.
        :return: The configured bucket or None if the bucket does not exist.
    """
    global GLOBAL_BUCKET

    # Return the cached bucket if already retrieved.
    if GLOBAL_BUCKET is not None:
        print(f"Returning cached bucket '{GLOBAL_BUCKET.name}'.")
        return GLOBAL_BUCKET

    try:
        # Use Google Cloud configuration defaults if provided and parameters are not set.
        if google_cloud_config:
            bucket_name = bucket_name or google_cloud_config.bucket_name
            project = project or google_cloud_config.project_name
            location = location or google_cloud_config.location
            storage_class = storage_class or google_cloud_config.storage_class

            enable_uniform_bucket_level_access = (enable_uniform_bucket_level_access or
                                                  google_cloud_config.enable_uniform_bucket_level_access or False)

            service_account_file_path = service_account_file_path or google_cloud_config.service_account_file_path
            cors = cors or google_cloud_config.cors

        # Prepare credentials if provided; otherwise use default credentials.
        # if service_account_file_path:
        #     credentials = service_account.Credentials.from_service_account_file(service_account_file_path)
        #     logger.info(f"Using provided service account credentials from '{service_account_file_path}'.")
        # else:
        #     credentials = None
        #     logger.info('Using default credentials.')

        credentials, project = default()

        if isinstance(credentials, Credentials):
            credentials = impersonated_credentials.Credentials(
                source_credentials=credentials,
                target_principal="morph-and-split-tool-sa@morph-and-split-tool.iam.gserviceaccount.com",
                target_scopes=["https://www.googleapis.com/auth/cloud-platform"],
                lifetime=3600
            )


        # Initialize the storage client.
        storage_client = storage.Client(credentials=credentials, project=project)

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
        GLOBAL_BUCKET = bucket
        return bucket

    except Exception as e:
        logger.exception(f"An error occurred while retrieving bucket '{bucket_name}': {e}")
        return None


def get_bucket_for_signed_url(bucket_name: Optional[str] = None,
                              project: Optional[str] = None,
                              location: Optional[str] = None,
                              storage_class: Optional[str] = None,
                              enable_uniform_bucket_level_access: bool = True,
                              service_account_file_path: Optional[str] = None,
                              cors: Optional[list[dict]] = None,
                              google_cloud_config: Optional[GoogleCloudStorageConfig] = None
                              ) -> Union[storage.Bucket, None]:
    """
        Retrieves a Google Cloud Storage (GCS) bucket with the given configuration.
        If the bucket exists, its configuration is updated if needed.

        Defaults for bucket name, project, location, storage class, uniform access,
        service account file, and CORS configuration are taken from google_cloud_config
        if provided.

        :param bucket_name: The bucket name (default from config if not provided).
        :param project: The GCP project (default from config if not provided).
        :param location: The bucket location (default from config if not provided).
        :param storage_class: The desired storage class (default from config if not provided).
        :param enable_uniform_bucket_level_access: Whether to enable uniform bucket-level access.
        :param service_account_file_path: Path to the service account key file.
               (default from config if not provided).
        :param cors: List of CORS configurations (default from config if not provided).
        :param google_cloud_config: A GoogleCloudStorageConfig instance for defaults.
        :return: The configured bucket or None if the bucket does not exist.
    """
    global GLOBAL_BUCKET_FOR_SIGNED_URLS

    # Return the cached bucket if already retrieved.
    if GLOBAL_BUCKET_FOR_SIGNED_URLS is not None:
        print(f"Returning cached bucket for signed urls '{GLOBAL_BUCKET_FOR_SIGNED_URLS.name}'.")
        return GLOBAL_BUCKET_FOR_SIGNED_URLS

    try:
        # Use Google Cloud configuration defaults if provided and parameters are not set.
        if google_cloud_config:
            bucket_name = bucket_name or google_cloud_config.bucket_name
            project = project or google_cloud_config.project_name
            location = location or google_cloud_config.location
            storage_class = storage_class or google_cloud_config.storage_class

            enable_uniform_bucket_level_access = (enable_uniform_bucket_level_access or
                                                  google_cloud_config.enable_uniform_bucket_level_access or False)

            service_account_file_path = service_account_file_path or google_cloud_config.service_account_file_path
            cors = cors or google_cloud_config.cors

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
        GLOBAL_BUCKET_FOR_SIGNED_URLS = bucket
        return bucket

    except Exception as e:
        logger.exception(f"An error occurred while retrieving bucket '{bucket_name}': {e}")
        return None


def reset_global_bucket_variables():
    """Reset global variables 'GLOBAL_BUCKET' AND 'GLOBAL_BUCKET_FOR_SIGNED_URLS' to None"""
    global GLOBAL_BUCKET_FOR_SIGNED_URLS
    global GLOBAL_BUCKET

    try:
        GLOBAL_BUCKET_FOR_SIGNED_URLS = None
        GLOBAL_BUCKET = None
        logger.info("Successfully reset global buckets to None.")
        return True

    except Exception as e:
        print(f"Unable to reset buckets: {e}")
        logger.exception(f"Error resetting global buckets: {e}")
        return False


# def create_directories_in_bucket(bucket_name: str,
#                                  directories: list[str],
#                                  project: Optional[str] = None,
#                                  location: Optional[str] = None,
#                                  storage_class: Optional[str] = None,
#                                  enable_uniform_bucket_level_access: bool = True,
#                                  service_account_file_path: Optional[str] = None,
#                                  cors: Optional[list[dict]] = None,
#                                  google_cloud_config: Optional[GoogleCloudStorageConfig] = None,
#                                  ) -> Union[storage.Bucket, None]:
#     """
#     Add directories to a Google Cloud Storage (GCS) bucket with the given configuration.
#
#     If the bucket exists, its configuration is updated.
#
#     :param bucket_name: The name of the GCS bucket. If not provided, the value from google_cloud_config.bucket_name is used.
#     :param directories: A list of directory names (blob paths) to be created in the bucket. Each directory is simulated
#                         by creating an empty blob with a trailing '/'.
#     :param project: The GCP project under which the bucket is to be created. Defaults to google_cloud_config.project_name
#                     if not provided.
#     :param location: The geographic location where the bucket is stored. Defaults to google_cloud_config.location if not provided.
#     :param storage_class: The desired storage class for the bucket (e.g., STANDARD, NEARLINE, COLDLINE, ARCHIVE).
#                           Defaults to google_cloud_config.storage_class if not provided.
#     :param enable_uniform_bucket_level_access: Whether to enable uniform bucket-level access. Defaults to True or the
#                                                  value specified in google_cloud_config.enable_uniform_bucket_level_access.
#     :param service_account_file_path: The file path to the service account JSON key. If not provided, the value from
#                                       google_cloud_config.service_account_file_path is used.
#     :param cors: A list of dictionaries defining the CORS configuration for the bucket.
#                  Defaults to google_cloud_config.cors if not provided.
#     :param google_cloud_config: An optional configuration object containing default values for bucket name, project,
#                                 location, storage class, uniform bucket-level access, service account file path, and CORS settings.
#                                 Any parameter not explicitly provided will fall back to the corresponding attribute from this object.
#
#     :return: The configured GCS bucket if the operation is successful; if the bucket does not exist, returns None.    """
#     try:
#         bucket = get_bucket(bucket_name=bucket_name,
#                             project=project,
#                             location=location,
#                             storage_class=storage_class,
#                             enable_uniform_bucket_level_access=enable_uniform_bucket_level_access,
#                             service_account_file_path=service_account_file_path,
#                             cors=cors,
#                             google_cloud_config=google_cloud_config)
#
#         if bucket is not None:
#             if directories:
#                 for directory in directories:
#                     # Append a trailing '/' to signify a folder and create an empty blob
#                     blob = bucket.blob(f"{directory}/")
#                     blob.upload_from_string("")
#                     logger.info(f"Created directory '{directory}'/ in bucket '{bucket_name}'")
#         return bucket
#
#     except Exception as e:
#         print(e)
#

def generate_signed_url(blob_name: str,
                        google_cloud_config: GoogleCloudStorageConfig,
                        method: str ='GET',
                        expiration: int =720,
                        content_type: Optional[str]=None,
                        ):
    """
    Generate a signed URL for a GCS blob.

    :param blob_name: The name of the blob.
    :param google_cloud_config: A GoogleCloudStorageConfig instance for defaults.
    :param method: The HTTP method to use (e.g. 'PUT', 'GET').
    :param expiration: The expiration of the URL in minutes.
    :param content_type: The content type of the URL, (e.g. 'application/octet-stream').
    :return: A secure signed url
    """
    # bucket = get_bucket(google_cloud_config=google_cloud_config)
    bucket = get_bucket_for_signed_url(google_cloud_config=google_cloud_config)
    blob = bucket.blob(blob_name)

    return blob.generate_signed_url(version="v4",
                                    expiration=timedelta(minutes=expiration),
                                    method=method,
                                    content_type=content_type,
                                    service_account_email="morph-and-split-tool-sa@morph-and-split-tool.iam.gserviceaccount.com"
                                    )


def delete_google_cloud_storage_bucket(google_cloud_config: Optional[GoogleCloudStorageConfig] ):
    """
    Deletes a new bucket in the US region with the STANDARD storage class.
    """
    global GLOBAL_BUCKET

    bucket_name = google_cloud_config.bucket_name
    try:

        # Initialize storage client
        # credentials = service_account.Credentials.from_service_account_file(google_cloud_config.service_account_file_path)

        credentials, project = default()

        storage_client = storage.Client(project=project,
                                        credentials=credentials)

        # Check if the bucket exists
        bucket = storage_client.lookup_bucket(bucket_name)

        if bucket is None:
            logger.info(f"Bucket {bucket_name} does not exist.")
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
        logging.info(f"Successfully deleted bucket {bucket_name}.")

        GLOBAL_BUCKET = None
        return True

    except GoogleAPIError as e:
        print(f"An error occurred while deleting the bucket: {e}")
        return False


def delete_and_recreate_directories_in_gcs_bucket(directories: list,
                                                  google_cloud_config: GoogleCloudStorageConfig,
                                                  ):
    """
    Deletes a directory (and all its contents) in a Google Cloud Storage bucket
    and recreates the directory.

    :param directories: (list) A list containing the directories to delete and recreate.
    :param google_cloud_config: An optional configuration object containing default values for bucket name, project,
                                location, storage class, uniform bucket-level access, service account file path, and CORS settings.
                                Any parameter not explicitly provided will fall back to the corresponding attribute from this object.
    :return: Success or Failure message
    """

    bucket_name = google_cloud_config.bucket_name
    try:
        # Use Google Cloud configuration defaults if provided and parameters are not set.

        # Get the bucket
        bucket = get_bucket(google_cloud_config=google_cloud_config)

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


def list_files_in_bucket_directory(directory_path:str,
                                   google_cloud_config: GoogleCloudStorageConfig) -> list:
    """
    List the names of specific files within a directory in a Google Cloud Storage bucket.

    :param google_cloud_config:
    :param directory_path: (str) Path to the directory whose files should be listed.
    :return: List of file names.
    """

    # project_name = google_cloud_config.project_name or None
    # credentials = service_account.Credentials.from_service_account_file(google_cloud_config.service_account_file_path) or None

    credentials, project_name = default()

    bucket_name = google_cloud_config.bucket_name

    storage_client = storage.Client(project=project_name, credentials=credentials)

    # list all blobs (files) in teh specific directory
    blobs = storage_client.list_blobs(bucket_or_name=bucket_name,
                                      prefix=directory_path,
                                      delimiter='/')

    return sort_filenames([blob.name.split('/')[-1] for blob in blobs if not blob.name.endswith("/")])


def upload_file_to_gcs_bucket(source_file_name:str,
                              destination_blob_name:str,
                              google_cloud_config: GoogleCloudStorageConfig):
    """
    Uploads a file to blob within a Google Cloud Storage bucket.

    :param google_cloud_config:
    :param source_file_name: (str) Path to the file to be uploaded.
    :param destination_blob_name: Name of the blob object in the bucket.
    """

    # Instantiate bucket object linked to the client
    bucket = get_bucket(google_cloud_config=google_cloud_config)

    # Instantiate existing blob
    blob = bucket.blob(destination_blob_name)

    # upload file to blob
    blob.upload_from_filename(source_file_name)
    logging.info(f"File {source_file_name} uploaded to {destination_blob_name}.")


def download_files_from_gcs_folder(bucket_name: str,
                                   source_folder_path: str,
                                   destination_folder_path: str,
                                   copy= True):
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

        logger.info(f"File(s) downloaded successfully from GCS:\n{result.stdout}")
        return True, f"File downloaded successfully to {destination_folder_path}."

    except subprocess.CalledProcessError as e:
        error_msg = e.stderr.decode("utf-8") if e.stderr else "Unknown error"
        logger.error(f"Error while copying file from Google Cloud Storage: {error_msg}")
        return False, error_msg


def upload_files_to_gcs_bucket(bucket_name: str,
                               source_folder_path: str,
                               destination_folder_path: str,
                               copy=True):
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
