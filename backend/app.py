from flask import Flask
from flask_cors import CORS

from app.routes import image_upload, mask_upload, file_download, augment
from app.utils import create_project_directories

# Flask app setup
app = Flask(__name__)
CORS(app)

# Create project directories
directories = create_project_directories()
IMAGE_DIR, MASK_DIR, AUGMENTED_DIR, TRAIN_DIR, VAL_DIR, TEST_DIR, VISUAL_ATTRIBUTES= directories.values()

for directory in directories.values():
    print(directory)


# Register blueprints
app.register_blueprint(image_upload)
app.register_blueprint(mask_upload)
app.register_blueprint(file_download)
app.register_blueprint(augment)


# Run Flask app in Jupyter Notebook
if __name__ == "__main__":
    from werkzeug.serving import run_simple
    run_simple('localhost', 5000, app)
