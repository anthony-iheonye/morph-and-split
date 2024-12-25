import gc
import json
import os
import zipfile

from flask import Blueprint, request, jsonify
from tensorflow.keras.backend import clear_session
from werkzeug.utils import secure_filename

from app.aug_config import aug_config
from app.services import DataSplitterAugmenterAndSaver, resize_augmented_data
from app.utils import directory_store

augment = Blueprint('augment', __name__)

VISUAL_ATTRIBUTES = directory_store.visual_attributes_dir
AUGMENTED_DIR = directory_store.augmented

channels = aug_config['imageMaskChannels']
image_channels = channels['imgChannels']
mask_channels = channels['maskChannels']


def save_aug_config(aug_config: dict, target_file: str):
    """
    Save the augmentation configuration Dict file as a Python script file.

    :param aug_config: (dict) The configuration dictionary file
    :param target_file: The file path where the Python script will be saved.
    """

    # Convert dictionary to a Python script string with correct formatting
    config_str = "aug_config = " + repr(aug_config).replace('false', 'False').replace('true', 'True')

    # save to the target file
    with open(target_file, 'w') as file:
        file.write(config_str + "\n")


@augment.route('/augment', methods=['POST'])
def augment_data():
    try:
        visual_attributes_file = request.files.getlist("visualAttributesJSONFile")
        config = request.form.get("config")

        # Parse the config JSON string into a dictionary
        aug_config: dict = json.loads(config)

        if visual_attributes_file:
            filename = secure_filename(visual_attributes_file[0].filename)
            visual_attributes_filepath = os.path.join(VISUAL_ATTRIBUTES, filename)
            visual_attributes_file[0].save(visual_attributes_filepath)
        else:
            visual_attributes_filepath = None

        # Define the path to the parent 'app' package
        current_dir = os.path.dirname(__file__)
        app_dir = os.path.abspath(os.path.join(current_dir, '..'))
        config_filepath = os.path.join(app_dir, 'aug_config.py')


        # Save the aug_config as a python script in the 'app' package
        save_aug_config(aug_config, config_filepath)

        augmenter = DataSplitterAugmenterAndSaver(images_directory=directory_store.image_dir,
                                                  masks_directory=directory_store.mask_dir,
                                                  train_directory=directory_store.train_dir,
                                                  val_directory=directory_store.val_dir,
                                                  test_directory=directory_store.test_dir,
                                                  initial_save_id_train=aug_config.get("initialTrainSaveId"),
                                                  initial_save_id_val=aug_config.get("initialValSaveId"),
                                                  initial_save_id_test=aug_config.get("initialTestSaveId"),
                                                  visual_attributes_json_path=visual_attributes_filepath,
                                                  image_mask_channels=tuple(aug_config.get("imageMaskChannels").values()),
                                                  final_image_shape=tuple(aug_config.get("augImageDimension").values()),
                                                  image_save_format='png',
                                                  image_save_prefix='img',
                                                  mask_save_prefix='mask',
                                                  val_size=aug_config.get('valRatio'),
                                                  test_size=aug_config.get('testRatio'),
                                                  seed=aug_config.get('seed'),
                                                  crop_image_and_mask=aug_config.get('crop'),
                                                  crop_dimension=tuple(aug_config.get("cropDimension").values()),
                                                  augmentation_prob=6,
                                                  augment_validation_data=aug_config.get('augmentValData'),
                                                  random_crop=aug_config.get('randomCrop'),
                                                  flip_left_right=aug_config.get('flipLeftRight'),
                                                  flip_up_down=aug_config.get('flipUpDown'),
                                                  random_rotate=aug_config.get('randomRotate'),
                                                  corrupt_brightness=aug_config.get('corruptBrightness'),
                                                  corrupt_contrast=aug_config.get('corruptContrast'),
                                                  corrupt_saturation=aug_config.get('corruptSaturation'),
                                                  cache_directory=None,
                                                  display_split_histogram=False,
                                                  number_of_training_images_after_augmentation=aug_config.get(
                                                      'totalAugmentedImages'))
        augmenter.process_data()

        # Create a ZIP file containing augmented images and masks.
        zip_path = os.path.join(AUGMENTED_DIR, 'augmented_data.zip')

        with zipfile.ZipFile(file=zip_path, mode='w') as zipf:
            for root, _, files in os.walk(AUGMENTED_DIR):
                for file in files:
                    if file != 'augmented_data.zip':  # Avoid including the ZIP file itself
                        file_path = os.path.join(root, file)
                        zipf.write(filename=file_path,
                                   arcname=os.path.relpath(file_path, AUGMENTED_DIR))

        # Store a resized version of the augmented results
        resize_augmented_data()

        return jsonify({'success': True}), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        # clear Tensorflow session and garbage collect unused variables
        clear_session()
        gc.collect()
