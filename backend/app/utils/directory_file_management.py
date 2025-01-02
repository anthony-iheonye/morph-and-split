import os
import re
import shutil
from typing import Union

import attr
from google.cloud import storage
from google.cloud.exceptions import NotFound
import subprocess

current_dir = os.path.dirname(__file__)
base_dir = os.path.abspath(os.path.join(current_dir, '../..'))

@attr.s
class DirectoryStore:
    asset_dir = attr.ib(type=str, default=os.path.join(base_dir, 'assets'))
    image_dir = attr.ib(type=str, init=False)
    mask_dir = attr.ib(type=str, init=False)

    resized_image_dir = attr.ib(type=str, init=False)
    resized_mask_dir = attr.ib(type=str, init=False)

    augmented = attr.ib(type=str, init=False)
    train_dir = attr.ib(type=str, init=False)
    train_image_dir = attr.ib(type=str, init=False)
    train_mask_dir = attr.ib(type=str, init=False)
    val_dir = attr.ib(type=str, init=False)
    val_image_dir = attr.ib(type=str, init=False)
    val_mask_dir = attr.ib(type=str, init=False)
    test_dir = attr.ib(type=str, init=False)
    test_image_dir = attr.ib(type=str, init=False)
    test_mask_dir = attr.ib(type=str, init=False)

    resized_augmented = attr.ib(type=str, init=False)
    resized_train_image_dir = attr.ib(type=str, init=False)
    resized_train_mask_dir = attr.ib(type=str, init=False)
    resized_val_image_dir = attr.ib(type=str, init=False)
    resized_val_mask_dir = attr.ib(type=str, init=False)
    resized_test_image_dir = attr.ib(type=str, init=False)
    resized_test_mask_dir = attr.ib(type=str, init=False)

    visual_attributes_dir = attr.ib(type=str, init=False)

    def __attrs_post_init__(self):
        # Set the paths that depend on other attributes
        self.image_dir = os.path.join(self.asset_dir, 'images')
        self.mask_dir = os.path.join(self.asset_dir, 'masks')

        self.resized_image_dir = os.path.join(self.asset_dir, 'resized_images')
        self.resized_mask_dir = os.path.join(self.asset_dir, 'resized_masks')

        self.augmented = os.path.join(self.asset_dir, 'augmented')
        self.train_dir = os.path.join(self.augmented, 'train')
        self.train_image_dir = os.path.join(self.train_dir, 'images')
        self.train_mask_dir = os.path.join(self.train_dir, 'masks')
        self.val_dir = os.path.join(self.augmented, 'val')
        self.val_image_dir = os.path.join(self.val_dir, 'images')
        self.val_mask_dir = os.path.join(self.val_dir, 'masks')
        self.test_dir = os.path.join(self.augmented, 'test')
        self.test_image_dir = os.path.join(self.test_dir, 'images')
        self.test_mask_dir = os.path.join(self.test_dir, 'masks')

        self.resized_augmented = os.path.join(self.asset_dir, 'resized_augmented')
        self.resized_train_image_dir = os.path.join(self.resized_augmented, 'train', 'images')
        self.resized_train_mask_dir = os.path.join(self.resized_augmented, 'train', 'masks')
        self.resized_val_image_dir = os.path.join(self.resized_augmented, 'val', 'images')
        self.resized_val_mask_dir = os.path.join(self.resized_augmented, 'val', 'masks')
        self.resized_test_image_dir = os.path.join(self.resized_augmented, 'test', 'images')
        self.resized_test_mask_dir = os.path.join(self.resized_augmented, 'test', 'masks')

        self.visual_attributes_dir = os.path.join(self.asset_dir, 'visual_attributes')


# Initialize DirectoryStore instance
directory_store = DirectoryStore()


def create_directory(dir_name, return_dir=False, overwrite_if_existing=False):
    """
    Create a directory. To return the new directory path, input True for the 'return_dir'.

    :param dir_name: name of directory
    :param return_dir: boolean, True to return the name of the directory
    :param overwrite_if_existing: if the folder is existing, and the "overwrite_if_exiting" parameter is set to True, the
        existing directory will be deleted and replaced with a new one.
    :return: name of the directory
    """
    if overwrite_if_existing:
        pathname = dir_name if dir_name[-1] == '/' else dir_name + '/'
        if os.path.exists(os.path.dirname(pathname)):
            shutil.rmtree(os.path.dirname(pathname), ignore_errors=True)

    os.makedirs(dir_name, exist_ok=True)
    if return_dir:
        if dir_name[-1] != '/':
            return dir_name + '/'
        else:
            return dir_name


def create_project_directories(return_dir=True, overwrite_if_existing=False):
    """
    Create directory for the uploaded images and masks, for the augmented training, validation and testing datasets.
    :returns: dictionary with keys 'image_dir', 'mask_dir', 'train_dir', 'val_dir' and 'test_dir'.
    """
    # Directory setup
    image_dir = create_directory(dir_name=directory_store.image_dir,
                                 return_dir=True,
                                 overwrite_if_existing=overwrite_if_existing)

    mask_dir = create_directory(dir_name=directory_store.mask_dir,
                                return_dir=True,
                                overwrite_if_existing=overwrite_if_existing)

    resized_image_dir = create_directory(dir_name=directory_store.resized_image_dir,
                                         return_dir=True,
                                         overwrite_if_existing=overwrite_if_existing)

    resized_mask_dir = create_directory(dir_name=directory_store.resized_mask_dir,
                                        return_dir=True,
                                        overwrite_if_existing=overwrite_if_existing)

    augmented_dir = create_directory(dir_name=directory_store.augmented,
                                     return_dir=True,
                                     overwrite_if_existing=overwrite_if_existing)

    train_dir = create_directory(dir_name=directory_store.train_dir,
                                 return_dir=True,
                                 overwrite_if_existing=overwrite_if_existing)

    val_dir = create_directory(dir_name=directory_store.val_dir,
                               return_dir=True,
                               overwrite_if_existing=overwrite_if_existing)

    test_dir = create_directory(dir_name=directory_store.test_dir,
                                return_dir=True,
                                overwrite_if_existing=overwrite_if_existing)

    visual_attribute_dir = create_directory(dir_name=directory_store.visual_attributes_dir, return_dir=True,
                                            overwrite_if_existing=overwrite_if_existing)

    if return_dir:
        return {'image_dir': image_dir,
                'mask_dir': mask_dir,
                'resized_image_dir': resized_image_dir,
                'resized_mask_dir': resized_mask_dir,
                'augmented_dir': augmented_dir,
                'train_dir': train_dir,
                'val_dir': val_dir,
                'test_dir': test_dir,
                'visual_attribute_dir': visual_attribute_dir}


def create_resized_augmentation_directories(return_dir=True, overwrite_if_existing=False):
    """
    Create directory for resized augmented training, validation and testing datasets.
    :returns: dictionary with keys 'image_dir', 'mask_dir', 'train_dir', 'val_dir' and 'test_dir'.
    """
    # Directory setup

    resized_augmented_dir = create_directory(dir_name=directory_store.augmented, return_dir=True,
                                             overwrite_if_existing=overwrite_if_existing)

    resized_train_image_dir = create_directory(dir_name=directory_store.resized_train_image_dir, return_dir=True,
                                               overwrite_if_existing=overwrite_if_existing)

    resized_train_mask_dir = create_directory(dir_name=directory_store.resized_train_mask_dir, return_dir=True,
                                              overwrite_if_existing=overwrite_if_existing)

    resized_val_image_dir = create_directory(dir_name=directory_store.resized_val_image_dir, return_dir=True,
                                             overwrite_if_existing=overwrite_if_existing)

    resized_val_mask_dir = create_directory(dir_name=directory_store.resized_val_mask_dir, return_dir=True,
                                            overwrite_if_existing=overwrite_if_existing)

    resized_test_image_dir = create_directory(dir_name=directory_store.resized_test_image_dir, return_dir=True,
                                              overwrite_if_existing=overwrite_if_existing)

    resized_test_mask_dir = create_directory(dir_name=directory_store.resized_test_mask_dir, return_dir=True,
                                             overwrite_if_existing=overwrite_if_existing)

    if return_dir:
        return {'resized_augmented_dir': resized_augmented_dir,
                'resized_train_image_dir': resized_train_image_dir,
                'resized_train_mask_dir': resized_train_mask_dir,
                'resized_val_image_dir': resized_val_image_dir,
                'resized_val_mask_dir': resized_val_mask_dir,
                'resized_test_image_dir': resized_test_image_dir,
                'resized_test_mask_dir': resized_test_mask_dir}


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

    :param directories:
    :param subdiretories:
    :param cors:
    :param bucket_name: The bucket name
    :param project: (str) The project under which the bucket is to be created. If not passed, uses the project set on the client.
    :param location: (str) Location where the bucket is stored
    :param storage_class: (str) The storage class. Can either be STANDARD (standard storage),
        `NEARLINE` (nearline storage), `COLDLINE` (coldline storage) or `ARCHIVE` (archive storage). View detailed description of each storage class visit: https://cloud.google.com/storage/docs/storage-classes#descriptions.
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


def delete_google_cloud_storage_bucket(bucket_name: str):
    """
    Deletes a new bucket in the US region with the STANDARD storage class.
    """
    # Create storage client
    storage_client = storage.Client()

    try:
        bucket = storage_client.get_bucket(bucket_name)
        # Delete the bucket
        bucket.delete()
        print(f"Bucket {bucket.name} deleted.")
    except NotFound:
        print(f"Bucket {bucket_name} does not exist.")


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

    # Initialize the storage client
    storage_client = storage.Client()

    # Instantiate bucket object linked to the client
    bucket = storage_client.bucket(bucket_name=bucket_name)

    # Instantiate existing blob
    blob = bucket.blob(destination_blob_name)

    # upload file to blob
    blob.upload_from_filename(source_file_name)
    print(f"File {source_file_name} uploaded to {destination_blob_name}.")


def download_files_from_gcs_folder(bucket_name: str, source_folder_path: str, destination_folder_path: str):
    """
    Copies files/folder from a Google Cloud Storage bucket to a local directory

    :param bucket_name: (str) The name of the GCS bucket.
    :param source_folder_path: (str) Path to the file/folder to be downloaded.
    :param destination_folder_path: (str) Path to the local directory.
    """
    try:
        source_directory = source_folder_path[:-2] if source_folder_path.endswith("/") else source_folder_path
        gcloud_command = ["gcloud",
                          "storage",
                          "cp",
                          f"gs://{bucket_name}/{source_directory}/*",
                          destination_folder_path
                          ]

        result = subprocess.run(gcloud_command, check=True, capture_output=True)

        print(f"File downloaded successfully!\n"
              f"{result.stdout.decode('utf-8')}\n")

    except subprocess.CalledProcessError as e:
        print("Error while copying file from Google Cloud Storage: ", e.stderr)
        return e.stderr


def current_directory(file_path=None):
    """Returns a files current directory."""
    if file_path:
        return os.path.dirname(os.path.abspath(file_path))
    else:
        return os.getcwd()


def sort_filenames(file_paths):
        return sorted(file_paths, key=lambda var: [
            int(x) if x.isdigit() else x.lower() for x in re.findall(r'\D+|\d+', var)
        ])


def get_sorted_filepaths(images_dir):
    """
    Generates the sorted list of path for images within a specified directory.

    :param images_dir: a directory containing images
    :return: Returns a list containing the file path for the images
    """
    image_file_list = os.listdir(path=images_dir)
    image_paths = [os.path.join(images_dir, filename) for filename in image_file_list]

    # sort the file paths in ascending order
    image_paths = sort_filenames(image_paths)

    return image_paths


def get_sorted_filenames(images_dir):
    """
    Generates the sorted list of path for images within a specified directory.

    :param images_dir: a directory containing images
    :return: Returns a list containing the file path for the images
    """
    image_file_list = os.listdir(path=images_dir)

    # sort the file paths in ascending order
    return sort_filenames(image_file_list)

