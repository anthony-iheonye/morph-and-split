import os.path

import attr
import string
import random
from typing import List, Dict

from app.utils import current_directory

# --- Global State ---
BUCKET_NAME = None
_google_cloud_config = None

def generate_unique_code(length=20):
    """Generate unique characters"""
    characters = string.ascii_letters.lower() + string.digits  # A-Z, a-z, 0-9
    return ''.join(random.choices(characters, k=length))


def generate_bucket_name() -> string:
    """Generate a unique name for a GCS bucket. All names are prefixed by `morph-and-split-assets-`."""
    global BUCKET_NAME

    if BUCKET_NAME is None:
        BUCKET_NAME = f'morph-and-split-assets-{generate_unique_code()}'

    return BUCKET_NAME


def reset_bucket_name():
    """Reset cached bucket name and config."""
    global BUCKET_NAME, _google_cloud_config
    BUCKET_NAME = None
    _google_cloud_config = None


@attr.s
class GoogleCloudStorageConfig:
    project_name: str = attr.ib(default='morph-and-split-tool')
    origin: List[str] = attr.ib(factory=lambda: ["*"])
    responseHeader: List[str] = attr.ib(factory=lambda: ["Content-Type", "x-goog-content-resumable"])
    method: List[str] = attr.ib(factory=lambda: ['PUT', 'POST', 'GET'])
    maxAgeSeconds: int = attr.ib(default=3600)
    cors: List[Dict] = attr.ib(factory=lambda: [{
        "origin": ["*"],
        "responseHeader": ["Content-Type", "x-goog-content-resumable"],
        "method": ['PUT', 'POST', 'GET'],
        "maxAgeSeconds": 3600,
    }])

    # Bucket and service account details
    bucket_name: str = attr.ib(factory=generate_bucket_name)
    location: str = attr.ib(default='US-SOUTH1')
    storage_class: str = attr.ib(default='STANDARD')
    enable_uniform_bucket_level_access: bool = attr.ib(default=True)
    service_account_file_name: str = attr.ib(default='morph-and-split-key.json')
    service_account_file_path: str = attr.ib(
        factory=lambda: str(os.path.join(current_directory(), 'morph-and-split-key.json')))


    image_dir: str = attr.ib(default='images')
    mask_dir: str = attr.ib(default='masks')
    resized_image_dir: str = attr.ib(default='resized_images')
    resized_mask_dir: str = attr.ib(default='resized_masks')
    resized_augmented: str = attr.ib(default='resized_augmented')
    resized_train_images_dir: str = attr.ib(default='resized_augmented/train/images')
    resized_train_masks_dir: str = attr.ib(default='resized_augmented/train/masks')
    resized_val_images_dir: str = attr.ib(default='resized_augmented/val/images')
    resized_val_masks_dir: str = attr.ib(default='resized_augmented/val/masks')
    resized_test_images_dir: str = attr.ib(default='resized_augmented/test/images')
    resized_test_masks_dir: str = attr.ib(default='resized_augmented/test/masks')
    augmented_dir: str = attr.ib(default='augmented/combined')


# --- Public Getter ---
def get_google_cloud_config() -> GoogleCloudStorageConfig:
    """Get the current Google Cloud config instance, recreating it if necessary."""
    global _google_cloud_config
    if _google_cloud_config is None:
        _google_cloud_config = GoogleCloudStorageConfig()
    return _google_cloud_config


def get_google_cloud_directories() -> List[str]:
    """Returns a list containing paths to all GCS directories/folders in the bucket."""
    config = get_google_cloud_config()
    return [config.image_dir,
            config.mask_dir,
            config.resized_image_dir,
            config.resized_mask_dir,
            config.resized_augmented,
            config.resized_train_images_dir,
            config.resized_train_masks_dir,
            config.resized_val_images_dir,
            config.resized_val_masks_dir,
            config.resized_test_images_dir,
            config.resized_test_masks_dir,
            config.augmented_dir,
            ]


def get_cors():
    config = get_google_cloud_config()
    return config.cors
