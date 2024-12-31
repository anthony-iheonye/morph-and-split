import os
import re
import shutil

import attr
from google.cloud import storage

from typing import Optional, Union


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
                                       ) -> Union[storage.Bucket, Exception, None]:
    """
    Create a new Google Cloud Storage (GCS) bucket.

    :param bucket_name: The bucket name
    :param project: (str) The project under which the bucket is to be created. If not passed, uses the project set on the client.
    :param location: (str) Location where the bucket is stored
    :param storage_class: (str) The storage class. Can either be STANDARD (standard storage),
        `NEARLINE` (nearline storage), `COLDLINE` (coldline storage) or `ARCHIVE` (archive storage). View detailed description of each storage class visit: https://cloud.google.com/storage/docs/storage-classes#descriptions.
    :param enable_uniform_bucket_level_access:
    :return: The GCS bucket
    """
    # Create storage client
    storage_client = storage.Client()

    # Instantiate a bucket object to be owned by the 'storage_client'.
    bucket = storage_client.bucket(bucket_name)

    # Set the storage_class
    bucket.storage_class = storage_class

    # Set uniform bucket-level access status
    bucket.iam_configuration.uniform_bucket_level_access_enabled = True if enable_uniform_bucket_level_access else False

    # Create the bucket
    new_bucket = storage_client.create_bucket(bucket_or_name=bucket, location=location, project=project)
    print(f"Created bucket {new_bucket.name} in {location} with storage class {storage_class}")

    return new_bucket


def delete_google_cloud_storage_bucket(bucket_name: str):
    """
    Deletes a new bucket in the US region with the STANDARD storage class.
    """
    # Create storage client
    storage_client = storage.Client()

    # Instantiate a bucket object to be owned by the 'storage_client'.
    bucket = storage_client.bucket(bucket_name)

    # Delete the bucket
    bucket.delete()
    print(f"Bucket {bucket.name} deleted.")


def create_google_cloud_storage_directories(bucket_name: str, directories: list):
    """
    Create directories for within a Google Cloud Storage bucket.

    :param bucket_name: (str) The name of the GCS bucket.
    :param directories:  A list of directory paths to create within the GCS bucket.
    :return:
    """
    # Create a storage client
    storage_client = storage.Client()

    # Instantiate a bucket object to be owned by `storage_client`.
    bucket = storage_client.bucket(bucket_name=bucket_name)

    for directory in directories:
        blob = bucket.blob(f"{directory}/")


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
