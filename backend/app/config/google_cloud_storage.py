import attr


@attr.s
class GoogleCloudStorageConfig:
    project_name = attr.ib(type=str, default='morph-and-split')
    origin = attr.ib(type=list, default=["*"])
    responseHeader = attr.ib(type=list, default=["Content-Type", "x-goog-content-resumable"])
    method = attr.ib(type=list, default=['PUT', 'POST', 'GET'])
    maxAgeSeconds = attr.ib(type=int, default=3600)

    # Bucket and service account details
    bucket_name = attr.ib(type=str, default='morph-and-split-assets')
    location = attr.ib(type=str, default='us-south1')
    storage_class = attr.ib(type=str, default='STANDARD')
    service_account_file_name = attr.ib(type=str, default='morph-and-split-key.json')

    image_dir = attr.ib(type=str, default='images')
    mask_dir = attr.ib(type=str, default='masks')
    resized_image_dir = attr.ib(type=str, default='resized_images')
    resized_mask_dir = attr.ib(type=str, default='resized_masks')
    resized_augmented = attr.ib(type=str, default='resized_augmented')
    resized_train_images_dir = attr.ib(type=str, default='resized_augmented/train/images')
    resized_train_masks_dir = attr.ib(type=str, default='resized_augmented/train/masks')
    resized_val_images_dir = attr.ib(type=str, default='resized_augmented/val/images')
    resized_val_masks_dir = attr.ib(type=str, default='resized_augmented/val/masks')
    resized_test_images_dir = attr.ib(type=str, default='resized_augmented/test/images')
    resized_test_masks_dir = attr.ib(type=str, default='resized_augmented/test/masks')
    augmented_dir = attr.ib(type=str, default='augmented/combined')


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
