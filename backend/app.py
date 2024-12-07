from flask import Flask
from flask_cors import CORS

from app.routes import image_upload, mask_upload, file_download, augment, image_mask_metadata, uploaded_image_names, \
    uploaded_mask_names, reset_session
from app.utils import create_project_directories

# Flask app setup
app = Flask(__name__)
CORS(app)

# Create project directories
directories = create_project_directories(overwrite_if_existing=False)

for directory in directories.values():
    print(directory)


# Register blueprints
app.register_blueprint(image_upload)
app.register_blueprint(mask_upload)
app.register_blueprint(image_mask_metadata)
app.register_blueprint(uploaded_image_names)
app.register_blueprint(uploaded_mask_names)
app.register_blueprint(reset_session)
app.register_blueprint(file_download)
app.register_blueprint(augment)


# Run Flask app in Jupyter Notebook
if __name__ == "__main__":
    from werkzeug.serving import run_simple
    run_simple('localhost', 5000, app)
