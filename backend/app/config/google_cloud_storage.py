import attr

@attr.s
class GoogleCloudStorageConfig:
    project_name = attr.ib(type=str, default='morph-and-split')
    bucket_name = attr.ib(type=str, default='morph-and-split-assets')
    origin = attr.ib(type=list, default=["*"])
    responseHeader = attr.ib(type=list, default=["Content-Type", "x-goog-content-resumable"])
    method = attr.ib(type=list, default=['PUT', 'POST', 'GET'])
    maxAgeSeconds = attr.ib(type=int, default=3600)

    # Bucket details
    location = attr.ib(type=str, default='us-south1')
    storage_class = attr.ib(type=str, default='STANDARD')

    image_dir = attr.ib(type=str, default='images')
    mask_dir = attr.ib(type=str, default='masks')
    resized_image_dir = attr.ib(type=str, default='resized_images')
    resized_mask_dir = attr.ib(type=str, default='resized_masks')
    train_images_dir = attr.ib(type=str, default='augmented/train/images')
    train_masks_dir = attr.ib(type=str, default='augmented/train/masks')
    val_images_dir = attr.ib(type=str, default='augmented/val/images')
    val_masks_dir = attr.ib(type=str, default='augmented/val/masks')
    test_images_dir = attr.ib(type=str, default='augmented/test/images')
    test_masks_dir = attr.ib(type=str, default='augmented/test/masks')

google_cloud_config = GoogleCloudStorageConfig()

DIRECTORIES = [google_cloud_config.image_dir,
               google_cloud_config.mask_dir,
               google_cloud_config.resized_image_dir,
               google_cloud_config.resized_mask_dir,
               google_cloud_config.train_images_dir,
               google_cloud_config.train_masks_dir,
               google_cloud_config.val_images_dir,
               google_cloud_config.val_masks_dir,
               google_cloud_config.test_images_dir,
               google_cloud_config.test_masks_dir
               ]
cors = [{
    "origin": google_cloud_config.origin,
    "responseHeader": google_cloud_config.responseHeader,
    "method": google_cloud_config.method,
    "maxAgeSeconds": google_cloud_config.maxAgeSeconds,
}]