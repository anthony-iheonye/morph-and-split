import os.path

import attr
from typing import List, Dict

from app.utils import current_directory


@attr.s
class GoogleCloudStorageConfig:
    project_name: str = attr.ib(default='morph-and-split')
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
    bucket_name: str = attr.ib(default='morph-and-split-assets')
    location: str = attr.ib(default='us-south1')
    storage_class: str = attr.ib(default='STANDARD')
    service_account_file_name: str = attr.ib(default='morph-and-split-key.json')
    enable_uniform_bucket_level_access: bool = attr.ib(default=True)
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


google_cloud_config = GoogleCloudStorageConfig()

DIRECTORIES = [google_cloud_config.image_dir,
               google_cloud_config.mask_dir,
               google_cloud_config.resized_image_dir,
               google_cloud_config.resized_mask_dir,
               google_cloud_config.resized_augmented,
               google_cloud_config.resized_train_images_dir,
               google_cloud_config.resized_train_masks_dir,
               google_cloud_config.resized_val_images_dir,
               google_cloud_config.resized_val_masks_dir,
               google_cloud_config.resized_test_images_dir,
               google_cloud_config.resized_test_masks_dir,
               google_cloud_config.augmented_dir,
               ]
cors = [{
    "origin": google_cloud_config.origin,
    "responseHeader": google_cloud_config.responseHeader,
    "method": google_cloud_config.method,
    "maxAgeSeconds": google_cloud_config.maxAgeSeconds,
}]
