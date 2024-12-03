import json
import os
import zipfile

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

from app.services.augment import DataSplitterAugmenterAndSaver
from app.utils import create_project_directories

# Flask app setup
app = Flask(__name__)
CORS(app)

# Create project directories
directories = create_project_directories()
IMAGE_DIR, MASK_DIR, AUGMENTED_DIR, TRAIN_DIR, VAL_DIR, TEST_DIR, VISUAL_ATTRIBUTES= directories.values()


@app.route('/augment', methods=['POST'])
def augment():
    # Handle uploaded files
    images = request.files.getlist("images")
    masks = request.files.getlist("masks")
    visual_attributes_file = request.files.getlist("visualAttributesJSONFile")[0]
    config = request.form.get("config")

    # Parse the config JSON string into a dictionary
    aug_config: dict = json.loads(config)

    # Save files locally
    image_data, mask_data = [], []
    for img in images:
        print(img.filename)
        filename = secure_filename(img.filename)
        filepath = os.path.join(IMAGE_DIR, filename)
        img.save(filepath)

        # read and encode the file
        # with open(filepath, 'rb') as file:
        #     encoded_image = base64.b64encode(file.read()).decode("utf-8")
        #
        # image_data.append({"filename": filename, "path": filepath, "data": encoded_image})

    for mask in masks:
        print(mask.filename)
        filename = secure_filename(mask.filename)
        filepath = os.path.join(MASK_DIR, filename)
        mask.save(filepath)

        # read and encode the file
        # with open(filepath, 'rb') as file:
        #     encoded_mask = base64.b64encode(file.read()).decode("utf-8")
        #
        # mask_data.append({"filename": filename, "path": filepath, "data": encoded_mask})

    if visual_attributes_file:
        print(visual_attributes_file.filename)
        filename = secure_filename(visual_attributes_file.filename)
        visual_attributes_filepath = os.path.join(VISUAL_ATTRIBUTES, filename)
        visual_attributes_file.save(visual_attributes_filepath)
    else:
        visual_attributes_filepath = None

    augmenter = DataSplitterAugmenterAndSaver(images_directory= IMAGE_DIR,
                                              masks_directory = MASK_DIR,
                                              train_directory = TRAIN_DIR,
                                              val_directory = VAL_DIR,
                                              test_directory = TEST_DIR,
                                              initial_save_id_train = aug_config.get("initialTrainSaveId"),
                                              initial_save_id_val = aug_config.get("initialValSaveId"),
                                              initial_save_id_test = aug_config.get("initialTestSaveId"),
                                              visual_attributes_json_path = visual_attributes_filepath,
                                              image_mask_channels = tuple(aug_config.get("imageMaskChannels").values()),
                                              image_format = 'png',
                                              final_image_size = tuple(aug_config.get("augImageDimension").values()),
                                              image_save_format = 'png',
                                              image_save_prefix = 'img',
                                              mask_save_prefix = 'mask',
                                              val_size = aug_config.get('valRatio'),
                                              test_size = aug_config.get('testRatio'),
                                              seed = aug_config.get('seed'),
                                              crop_image_and_mask = aug_config.get('crop'),
                                              crop_dimension = tuple(aug_config.get("cropDimension").values()),
                                              augmentation_prob = 6,
                                              augment_validation_data = aug_config.get('augmentValData'),
                                              random_crop = aug_config.get('randomCrop'),
                                              flip_left_right = aug_config.get('flipLeftRight'),
                                              flip_up_down = aug_config.get('flipUpDown'),
                                              random_rotate = aug_config.get('randomRotate'),
                                              corrupt_brightness = aug_config.get('corruptBrightness'),
                                              corrupt_contrast = aug_config.get('corruptContrast'),
                                              corrupt_saturation = aug_config.get('corruptSaturation'),
                                              cache_directory = None,
                                              display_split_histogram = False,
                                              number_of_training_images_after_augmentation = aug_config.get('totalAugmentedImages'))
    augmenter.process_data()

    # Create a ZIP file containing augmented images and masks.
    zip_path = os.path.join(AUGMENTED_DIR, 'augmented_data.zip')

    with zipfile.ZipFile(file=zip_path, mode='w') as zipf:
        for root, _, files in os.walk(AUGMENTED_DIR):
            for file in files:
                if file != 'augmented_data.zip':    # Avoid including the ZIP file itself
                    file_path = os.path.join(root, file)
                    zipf.write(filename=file_path,
                               arcname=os.path.relpath(file_path, AUGMENTED_DIR))


    return jsonify({
        # "images": image_data,
        # "masks": mask_data,
        # "config": config,
        "zipPath": zip_path,
    }), 200

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    zip_path = os.path.join(AUGMENTED_DIR, filename)
    if os.path.exists(zip_path):
        return send_file(zip_path, as_attachment=True)
    else:
        return jsonify({"error": "File not found"}), 404

# Run Flask app in Jupyter Notebook
if __name__ == "__main__":
    from werkzeug.serving import run_simple
    run_simple('localhost', 5000, app)
