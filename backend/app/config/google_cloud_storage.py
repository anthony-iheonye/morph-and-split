import attr

@attr.s
class GoogleCloudStorageConfig:
    project_name = attr.ib(type=str, default='morph-and-split')
    bucket_name = attr.ib(type=str, default='morph-and-split-assets')
    origin = attr.ib(type=list, default=["*"])
    responseHeader = attr.ib(type=list, default=["Content-Type", "x-goog-content-resumable"])
    method = attr.ib(type=list, default=['PUT', 'POST', 'GET'])
    maxAgeSeconds = attr.ib(type=int, default=3600)


google_cloud_config = GoogleCloudStorageConfig()

cors = [{
    "origin": google_cloud_config.origin,
    "responseHeader": google_cloud_config.responseHeader,
    "method": google_cloud_config.method,
    "maxAgeSeconds": google_cloud_config.maxAgeSeconds,
}]