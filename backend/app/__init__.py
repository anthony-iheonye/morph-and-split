from flask import Flask
from flask_cors import CORS
import os

from app import aug_config
from app.routes import image_upload, mask_upload, file_download, augment, image_mask_metadata, uploaded_image_names, \
    uploaded_mask_names, reset_session, signed_upload_url
from app.utils import create_project_directories, create_google_cloud_storage_bucket, current_directory, set_cors_configuration

def create_app():
    # Flask app setup
    app = Flask(__name__)
    CORS(app)

    # Create project directories
    create_project_directories(return_dir=False, overwrite_if_existing=False)
    set_cors_configuration(bucket_name='morph-and-split-assets')

    # Create Google Cloud Storage

    # create_google_cloud_storage_bucket(bucket_name='morph-and-split-assets',
    #                                    project='morph-and-split')

    # Register blueprints
    app.register_blueprint(signed_upload_url)
    app.register_blueprint(image_upload)
    app.register_blueprint(mask_upload)
    app.register_blueprint(image_mask_metadata)
    app.register_blueprint(uploaded_image_names)
    app.register_blueprint(uploaded_mask_names)
    app.register_blueprint(reset_session)
    app.register_blueprint(file_download)
    app.register_blueprint(augment)

    return app