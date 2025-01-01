import attr

DIRECTORIES = ['assets/images',
               'assets/masks',
               'assets/resized_images',
               'assets/resized_masks',
               'assets/augmented/train/images',
               'assets/augmented/train/masks',
               'assets/augmented/val/images',
               'assets/augmented/val/masks',
               'assets/augmented/test/images',
               'assets/augmented/test/masks',
               ]

@attr.s
class GoogleCloudStorageConfig:
    project_name = attr.ib(type=str, default='morph-and-split')
    bucket_name = attr.ib(type=str, default='morph-and-split-assets')
    origin = attr.ib(type=list, default=["*"])
    responseHeader = attr.ib(type=list, default=["Content-Type", "x-goog-content-resumable"])
    method = attr.ib(type=list, default=['PUT', 'POST', 'GET'])
    maxAgeSeconds = attr.ib(type=int, default=3600)
    directories = attr.ib(type=list, default=DIRECTORIES)


google_cloud_config = GoogleCloudStorageConfig()

cors = [{
    "origin": google_cloud_config.origin,
    "responseHeader": google_cloud_config.responseHeader,
    "method": google_cloud_config.method,
    "maxAgeSeconds": google_cloud_config.maxAgeSeconds,
}]