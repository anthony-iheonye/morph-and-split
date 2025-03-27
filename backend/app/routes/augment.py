import gc
import importlib.util
import json
import os
import sys
import zipfile

from flask import Blueprint, request, jsonify
from tensorflow.keras.backend import clear_session

from app.services import DataSplitterAugmenterAndSaver, resize_augmented_data
from app.services import session_store
from app.utils import list_filenames

augment = Blueprint('augment', __name__)


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


def load_updated_aug_config():
    """
    Load the updated augmentation configuration file dynamically after modification.
    """
    # config_filepath = os.path.join(os.path.dirname(__file__), '..', 'app', 'aug_config.py')
    current_dir = os.path.dirname(__file__)
    app_dir = os.path.abspath(os.path.join(current_dir, '..'))
    config_filepath = os.path.join(app_dir, 'aug_config.py')

    # Remove cached module if it exists
    if 'app.aug_config' in sys.modules:
        del sys.modules['app.aug_config']

    # Load the module dynamically
    spec = importlib.util.spec_from_file_location('app.aug_config', config_filepath)
    aug_config_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(aug_config_module)

    return aug_config_module.aug_config


def convert_str_bools(obj: dict):
    """
    Recursively converts string boolean values in a Python data structure
    from "true"/"false" (as strings) to their corresponding Python boolean
    values True/False.

    This function supports nested dictionaries and lists.

    Args:
        obj (Any): The input data which may contain string booleans.
                   Can be a dict, list, string, or any other type.

    Returns:
        Any: A new data structure with "true"/"false" strings replaced
             by Python boolean values True/False.
    """
    if isinstance(obj, dict):
        return {k: convert_str_bools(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_str_bools(item) for item in obj]
    elif obj == "true":
        return True
    elif obj == "false":
        return False
    else:
        return obj


@augment.route('/augment', methods=['POST'])
def augment_data():
    """Augment image-mask pairs"""

    session_id = request.args.get('sessionId')
    directory_store = session_store.get_directory_store(session_id=session_id)

    stratification_data_dir = directory_store.stratification_data_file_dir
    augmented_dir = directory_store.augmented

    try:
        config = request.form.get("config")

        # Parse the config JSON string into a dictionary
        aug_config_data: dict = json.loads(config)
        aug_config = convert_str_bools(aug_config_data)

        file_paths = list_filenames(stratification_data_dir)
        if file_paths:
            stratification_data_filepath = str(os.path.join(stratification_data_dir, file_paths[0]))
        else:
            stratification_data_filepath = None


        # set augmentation status to running
        session_store.set_augmentation_running(session_id=session_id)

        augmenter = DataSplitterAugmenterAndSaver(images_directory=directory_store.image_dir,
                                                  masks_directory=directory_store.mask_dir,
                                                  train_directory=directory_store.train_dir,
                                                  val_directory=directory_store.val_dir,
                                                  test_directory=directory_store.test_dir,
                                                  initial_save_id_train=aug_config.get("initialTrainSaveId"),
                                                  initial_save_id_val=aug_config.get("initialValSaveId"),
                                                  initial_save_id_test=aug_config.get("initialTestSaveId"),
                                                  visual_attributes_json_path=stratification_data_filepath,
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
        zip_path = os.path.join(augmented_dir, 'augmented_data.zip')

        with zipfile.ZipFile(file=zip_path, mode='w') as zipf:
            for root, _, files in os.walk(augmented_dir):
                for file in files:
                    if file != 'augmented_data.zip':  # Avoid including the ZIP file itself
                        file_path = str(os.path.join(root, file))
                        zipf.write(filename=file_path,
                                   arcname=os.path.relpath(file_path, augmented_dir))

        # Store a resized version of the augmented results
        resize_augmented_data(session_id=session_id)

        # Clear the augmentation status after completion
        session_store.clear_augmentation_running(session_id=session_id)

        return jsonify({'success': True}), 201

    except Exception as e:
        session_store.clear_augmentation_running(session_id=session_id)
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        # clear Tensorflow session and garbage collect unused variables
        clear_session()
        gc.collect()
