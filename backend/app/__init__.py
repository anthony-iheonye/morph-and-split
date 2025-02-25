from flask import Flask
from flask_cors import CORS
import logging

from app.routes import (
    augment,
    directory_management,
    download_data_from_gcs,
    transfer_data_to_gcs,
    download_file,
    status_checks,
    gcs_management,
    image_mask_metadata,
    image_upload,
    mask_upload,
    resize_data,
    reset_session,
    signed_upload_urls,
    signed_download_urls,
    uploaded_file_names,
)


def create_app():
    # Set up logging to DEBUG mode
    # logging.basicConfig(level=logging.INFO)

    # Flask app setup
    app = Flask(__name__)
    CORS(app)

    # Register blueprints
    app.register_blueprint(directory_management)
    app.register_blueprint(signed_upload_urls)
    app.register_blueprint(signed_download_urls)
    app.register_blueprint(image_upload)
    app.register_blueprint(mask_upload)
    app.register_blueprint(download_data_from_gcs)
    app.register_blueprint(transfer_data_to_gcs)
    app.register_blueprint(resize_data)
    app.register_blueprint(image_mask_metadata)
    app.register_blueprint(uploaded_file_names)
    app.register_blueprint(reset_session)
    app.register_blueprint(download_file)
    app.register_blueprint(augment)
    app.register_blueprint(status_checks)
    app.register_blueprint(gcs_management)

    return app