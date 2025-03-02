import os

from flask import Blueprint, request, jsonify

from app.services import validate_stratification_data_file
from app.utils import directory_store, list_filenames, ValidationError

upload_stratification_data_file = Blueprint('upload_stratification_data_file', __name__)
STRATIFICATION_DATA_DIR = directory_store.stratification_data_file_dir


@upload_stratification_data_file.route('/upload/backend/stratification_file', methods=['POST'])
def upload_stratification_file():
    try:
        files = request.files.getlist("stratificationDataFile")
        no_of_images = len(list_filenames(directory_store.image_dir))

        if not files:
            return jsonify({'success': False, 'error': "No file was uploaded", 'results': []}), 400

        stratification_data_file = files[0]
        filename = stratification_data_file.filename
        save_path = os.path.join(STRATIFICATION_DATA_DIR, filename)
        stratification_data_file.save(save_path)

        try:
            stratification_parameters = validate_stratification_data_file(
                file_path=save_path, number_of_image_mask_pairs=no_of_images
            )
            return jsonify({'success': True, 'results': stratification_parameters}), 200

        except ValidationError as ve:
            return jsonify({'success': False, 'error': ve.error, 'message': ve.description}), 400

    except Exception as e:
        return jsonify({'success': False, 'error': "Internal Server Error", 'message': str(e)}), 500