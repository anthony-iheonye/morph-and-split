import logging
from typing import Optional, List

from google.cloud import storage
from app.config import GoogleCloudStorageConfig
from app.utils.directory_file_management import DirectoryStore

logger = logging.getLogger(__name__)

class AugmentationConfig:
    """Augmentation configuration for a session."""
    def __init__(self,
                 images_directory,
                 masks_directory,
                 train_directory,
                 val_directory,
                 test_directory,
                 initial_save_id_train,
                 initial_save_id_val,
                 initial_save_id_test,
                 visual_attributes_json_path,
                 image_mask_channels,
                 final_image_shape,
                 image_save_format,
                 image_save_prefix,
                 mask_save_prefix,
                 val_size,
                 test_size,
                 seed,
                 crop_image_and_mask,
                 crop_dimension,
                 augmentation_prob,
                 augment_validation_data,
                 random_crop,
                 flip_left_right,
                 flip_up_down,
                 random_rotate,
                 corrupt_brightness,
                 corrupt_contrast,
                 corrupt_saturation,
                 cache_directory,
                 display_split_histogram,
                 number_of_training_images_after_augmentation):
        """Initializes the configuration parameters for image augmentation."""
        self.images_directory = images_directory
        self.masks_directory = masks_directory
        self.train_directory = train_directory
        self.val_directory = val_directory
        self.test_directory = test_directory
        self.initial_save_id_train = initial_save_id_train
        self.initial_save_id_val = initial_save_id_val
        self.initial_save_id_test = initial_save_id_test
        self.visual_attributes_json_path = visual_attributes_json_path
        self.image_mask_channels = image_mask_channels
        self.final_image_shape = final_image_shape
        self.image_save_format = image_save_format
        self.image_save_prefix = image_save_prefix
        self.mask_save_prefix = mask_save_prefix
        self.val_size = val_size
        self.test_size = test_size
        self.seed = seed
        self.crop_image_and_mask = crop_image_and_mask
        self.crop_dimension = crop_dimension
        self.augmentation_prob = augmentation_prob
        self.augment_validation_data = augment_validation_data
        self.random_crop = random_crop
        self.flip_left_right = flip_left_right
        self.flip_up_down = flip_up_down
        self.random_rotate = random_rotate
        self.corrupt_brightness = corrupt_brightness
        self.corrupt_contrast = corrupt_contrast
        self.corrupt_saturation = corrupt_saturation
        self.cache_directory = cache_directory
        self.display_split_histogram = display_split_histogram
        self.number_of_training_images_after_augmentation = number_of_training_images_after_augmentation


class SessionStore:
    """
    Manages per-session state including buckets, directory stores,
    signed URLs, and status flags for image augmentation and upload processes.
    """
    def __init__(self):
        """Initializes internal caches and status dictionaries for session tracking."""
        self.gcs_config = GoogleCloudStorageConfig()
        self._bucket_cache: dict[str, storage.Bucket] = {}
        self._signed_url_bucket_cache: dict[str, storage.Bucket] = {}
        self._directory_store_cache: dict[str, DirectoryStore] = {}

        self._signed_resized_image_mask_urls: dict[str, Optional[List[str]]] = {}
        self._signed_training_set_urls: dict[str, Optional[List[str]]] = {}
        self._signed_validation_set_urls: dict[str, Optional[List[str]]] = {}
        self._signed_test_set_urls: dict[str, Optional[List[str]]] = {}

        self._session_is_running: dict[str, bool] = {}
        self._augmentation_is_running: dict[str, bool] = {}
        self._uploading_images: dict[str, bool] = {}
        self._uploading_masks: dict[str, bool] = {}

        self._image_dimension: dict[str, Optional[dict[str, int]]] = {}

    def set_image_dimension(self, session_id: str, height: int, width: int):
        """Set the image height and width for a session."""
        self._image_dimension[session_id] = {'height': height, 'width': width}

    def get_image_dimension(self, session_id: str):
        return self._image_dimension.get(session_id, None)

    def clear_image_dimension(self, session_id: str):
        self._image_dimension.pop(session_id, None)

    def set_is_uploading_images(self, session_id: str):
        """Marks that images are currently being uploaded for the session."""
        self._uploading_images[session_id] = True

    def set_is_uploading_masks(self, session_id: str):
        """Marks that masks are currently being uploaded for the session."""
        self._uploading_masks[session_id] = True

    def image_is_uploading(self, session_id: str):
        """Returns whether image uploading is in progress for the session."""
        return self._uploading_images.get(session_id, False)

    def mask_is_uploading(self, session_id: str):
        """Returns whether mask uploading is in progress for the session."""
        return self._uploading_masks.get(session_id, False)

    @staticmethod
    def get_bucket_name(session_id: str) -> str:
        """Creates the bucket name for a particular session ID."""
        return f"morph-and-split-assets-{session_id}"

    def get_directory_store(self, session_id: str) -> DirectoryStore:
        """Returns the directory store for a session, initializing if not cached."""
        if session_id in self._directory_store_cache:
            return self._directory_store_cache[session_id]
        directory_store = DirectoryStore(session_id=session_id)
        self._directory_store_cache[session_id] = directory_store
        return directory_store

    def clear_directory_store(self, session_id: str):
        """Clears the cached directory store for a session."""
        self._directory_store_cache.pop(session_id, None)

    def get_bucket(self, session_id: str) -> Optional[storage.Bucket]:
        """Returns the cached GCS bucket for a session, if it exists."""
        if session_id in self._bucket_cache:
            print(f"Returning cached bucket: {self.get_bucket_name(session_id)}")
            return self._bucket_cache.get(session_id)
        return None

    def set_bucket(self, session_id: str, bucket: storage.Bucket) -> None:
        """Stores a bucket in the session's bucket cache."""
        self._bucket_cache[session_id] = bucket

    def clear_bucket(self, session_id: str) -> None:
        """Clears the bucket cache for a session."""
        self._bucket_cache.pop(session_id, None)

    def get_signed_url_bucket(self, session_id: str) -> Optional[storage.Bucket]:
        """Returns the signed URL bucket for a session, if cached."""
        if session_id in self._bucket_cache:
            print(f"Returning cached signed url bucket: {self.get_bucket_name(session_id)}")
            return self._signed_url_bucket_cache.get(session_id)
        return None

    def set_signed_url_bucket(self, session_id: str, bucket: storage.Bucket) -> None:
        """Stores a signed URL bucket in the cache for a session."""
        self._signed_url_bucket_cache[session_id] = bucket

    def clear_signed_url_bucket(self, session_id: str) -> None:
        """Clears the signed URL bucket cache for a session."""
        self._signed_url_bucket_cache.pop(session_id, None)

    def get_signed_resized_image_mask_urls(self, session_id) -> Optional[List[str]]:
        """Gets the signed URLs for resized image and mask set for a session."""
        return self._signed_resized_image_mask_urls.get(session_id)

    def get_signed_training_set_urls(self, session_id) -> Optional[List[str]]:
        """Gets the signed URLs for training set for a session."""
        return self._signed_training_set_urls.get(session_id)

    def get_signed_validation_set_urls(self, session_id) -> Optional[List[str]]:
        """Gets the signed URLs for validation set for a session."""
        return self._signed_validation_set_urls.get(session_id)

    def get_signed_test_set_urls(self, session_id) -> Optional[List[str]]:
        """Gets the signed URLs for test set for a session."""
        return self._signed_test_set_urls.get(session_id)

    def set_signed_resized_image_mask_urls(self, session_id: str, urls: List[str]) -> None:
        """Sets the signed URLs for resized image and mask set for a session."""
        self._signed_resized_image_mask_urls[session_id] = urls

    def set_signed_training_set_urls(self, session_id: str, urls: List[str]) -> None:
        """Sets the signed URLs for training set for a session."""
        self._signed_training_set_urls[session_id] = urls

    def set_signed_validation_set_urls(self, session_id: str, urls: List[str]) -> None:
        """Sets the signed URLs for validation set for a session."""
        self._signed_validation_set_urls[session_id] = urls

    def set_signed_test_set_urls(self, session_id: str, urls: List[str]) -> None:
        """Sets the signed URLs for test set for a session."""
        self._signed_test_set_urls[session_id] = urls

    def reset_signed_urls_for_resized_images_and_masks(self, session_id: str) -> None:
        """Resets (clears) the signed URLs for resized images and masks."""
        self._signed_resized_image_mask_urls[session_id] = None

    def reset_signed_urls_for_train_val_test_data(self, session_id: str) -> None:
        """Resets signed URLs for train, validation, and test datasets."""
        self._signed_training_set_urls[session_id] = None
        self._signed_validation_set_urls[session_id] = None
        self._signed_test_set_urls[session_id] = None

    def reset_all_signed_download_urls(self, session_id: str) -> None:
        """Resets all signed download URLs for the session."""
        self._signed_resized_image_mask_urls[session_id] = None
        self._signed_training_set_urls[session_id] = None
        self._signed_validation_set_urls[session_id] = None
        self._signed_test_set_urls[session_id] = None

    def clear_all_signed_download_urls(self, session_id: str) -> None:
        """Clears all signed download URLs from the cache for a session."""
        self._signed_resized_image_mask_urls.pop(session_id, None)
        self._signed_training_set_urls.pop(session_id, None)
        self._signed_validation_set_urls.pop(session_id, None)
        self._signed_test_set_urls.pop(session_id, None)

    def set_session_running(self, session_id):
        """Marks the session as currently running."""
        self._session_is_running[session_id] = True

    def clear_session_running(self, session_id):
        """Marks the session as no longer running."""
        self._session_is_running.pop(session_id, None)

    def is_session_running(self, session_id):
        """Checks if the session is currently running."""
        return self._session_is_running.get(session_id, False)

    def set_augmentation_running(self, session_id):
        """Marks that augmentation is running for a session."""
        self._augmentation_is_running[session_id] = True

    def clear_augmentation_running(self, session_id):
        """Marks that augmentation has stopped for a session."""
        self._augmentation_is_running.pop(session_id, None)

    def is_augmentation_running(self, session_id):
        """Checks whether augmentation is currently running for a session."""
        return self._augmentation_is_running.get(session_id, False)

    def clear_session(self, session_id: str) -> None:
        """Clears all cached data and state for a specific session."""
        self.clear_bucket(session_id)
        self.clear_signed_url_bucket(session_id)
        self.clear_directory_store(session_id)
        self.clear_all_signed_download_urls(session_id)
        self.clear_augmentation_running(session_id)
        self.clear_session_running(session_id)

    def clear_all_sessions(self):
        """Clears all session-related caches and states across all sessions."""
        self._bucket_cache.clear()
        self._signed_url_bucket_cache.clear()
        self._directory_store_cache.clear()
        self._signed_resized_image_mask_urls.clear()
        self._signed_training_set_urls.clear()
        self._signed_validation_set_urls.clear()
        self._signed_test_set_urls.clear()
        self._session_is_running.clear()
        self._augmentation_is_running.clear()


# Global Instance
session_store = SessionStore()
