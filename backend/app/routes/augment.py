import json
import os
import zipfile
from tensorflow.keras.backend import clear_session
import gc

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

from app.services.augment import DataSplitterAugmenterAndSaver
from app.utils import directory_store

augment = Blueprint('augment', __name__)

VISUAL_ATTRIBUTES = directory_store.visual_attributes_dir
AUGMENTED_DIR = directory_store.augmented

@augment.route('/augment', methods=['POST'])
def augment_data():
    try:
        visual_attributes_file = request.files.getlist("visualAttributesJSONFile")
        config = request.form.get("config")

        # Parse the config JSON string into a dictionary
        aug_config: dict = json.loads(config)

        if visual_attributes_file:
            print(visual_attributes_file[0].filename)
            filename = secure_filename(visual_attributes_file[0].filename)
            visual_attributes_filepath = os.path.join(VISUAL_ATTRIBUTES, filename)
            visual_attributes_file[0].save(visual_attributes_filepath)
        else:
            visual_attributes_filepath = None

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
                                                  image_format='png',
                                                  final_image_size=tuple(aug_config.get("augImageDimension").values()),
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

        return jsonify({'success': True}), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        # clear Tensorflow session and garbage collect unused variables
        clear_session()
        gc.collect()
