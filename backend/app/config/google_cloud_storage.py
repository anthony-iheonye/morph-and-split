import os.path
from typing import List, Dict

import attr

from app.utils import current_directory


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

    @property
    def gcs_directories(self):
        return [self.image_dir,
                self.mask_dir,
                self.resized_image_dir,
                self.resized_mask_dir,
                self.resized_augmented,
                self.resized_train_images_dir,
                self.resized_train_masks_dir,
                self.resized_val_images_dir,
                self.resized_val_masks_dir,
                self.resized_test_images_dir,
                self.resized_test_masks_dir,
                self.augmented_dir,
                ]

    @property
    def gcs_cors(self):
        return self.cors

