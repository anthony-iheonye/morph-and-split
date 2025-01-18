from flask import Flask
from flask_cors import CORS

from app.routes import (
    augment,
    augmentation_status,
    delete_session,
    directory_management,
    download_data_from_gcs,
    file_download,
    file_upload_status,
    gcs_management,
    image_mask_metadata,
    image_upload,
    mask_upload,
    resize_data,
    reset_session,
    signed_upload_url,
    uploaded_file_names,
)


def create_app():
    # Flask app setup
    app = Flask(__name__)
    CORS(app)

    # Register blueprints
    app.register_blueprint(directory_management)
    app.register_blueprint(signed_upload_url)
    app.register_blueprint(image_upload)
    app.register_blueprint(mask_upload)
    app.register_blueprint(download_data_from_gcs)
    app.register_blueprint(resize_data)
    app.register_blueprint(image_mask_metadata)
    app.register_blueprint(uploaded_file_names)
    app.register_blueprint(reset_session)
    app.register_blueprint(file_download)
    app.register_blueprint(augment)
    app.register_blueprint(delete_session)
    app.register_blueprint(file_upload_status)
    app.register_blueprint(augmentation_status)
    app.register_blueprint(gcs_management)

    return app