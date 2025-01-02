from flask import Flask
from flask_cors import CORS
from app.config import google_cloud_config, cors, DIRECTORIES
from app import aug_config
from app.routes import image_upload, mask_upload, file_download, augment, image_mask_metadata, uploaded_image_names, \
    uploaded_mask_names, reset_session, signed_upload_url, download_uploaded_images_from_gcs, \
    download_uploaded_masks_from_gcs, resize_uploaded_images, resize_uploaded_masks
from app.utils import create_project_directories, create_google_cloud_storage_bucket, current_directory

def create_app():
    # Flask app setup
    app = Flask(__name__)
    CORS(app)

    # Create project directories
    create_project_directories(return_dir=False, overwrite_if_existing=False)

    # Create Google Cloud Storage
    create_google_cloud_storage_bucket(bucket_name=google_cloud_config.bucket_name,
                                       project=google_cloud_config.project_name,
                                       location=google_cloud_config.location,
                                       storage_class=google_cloud_config.storage_class,
                                       cors=cors,
                                       directories=DIRECTORIES)

    # Register blueprints
    app.register_blueprint(signed_upload_url)
    app.register_blueprint(image_upload)
    app.register_blueprint(mask_upload)
    app.register_blueprint(download_uploaded_images_from_gcs)
    app.register_blueprint(download_uploaded_masks_from_gcs)
    app.register_blueprint(resize_uploaded_images)
    app.register_blueprint(resize_uploaded_masks)
    app.register_blueprint(image_mask_metadata)
    app.register_blueprint(uploaded_image_names)
    app.register_blueprint(uploaded_mask_names)
    app.register_blueprint(reset_session)
    app.register_blueprint(file_download)
    app.register_blueprint(augment)

    return app